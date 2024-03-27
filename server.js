const express = require("express");
const sql = require("mssql");
const config = require("./DBfiles/dbConfig");
const cors = require("cors");
const moment = require("moment");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const nodemailer = require("nodemailer");
const app = express();
const stripe = require("stripe")(
  "sk_test_51MGUYTDOr8Rh3rU05Ctrd3ffn7VLIcxbIuDpDKkYY96JlgNRuQjnO9pgYUsTPWQtfADTqXMmF6obCSOwvtn8jA5x00J4Xi0Bqy"
);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const uuid = require("uuid");
const id = uuid.v4();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());
app.get("/api/data", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * from tblCars");

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    const pool = await sql.connect(config);
    let userID = null;

    if (refreshToken) {
      const result2 = await pool
        .request()
        .input("refreshToken", sql.VarChar, refreshToken)
        .query(
          `SELECT userID 
          FROM tblUsers
          WHERE refreshToken = @refreshToken`
        );

      userID = result2.recordset[0].userID;
    }

    const numberOfDays = req.body.NumberOfDays;
    const totalCost = req.body.Total_Cost * numberOfDays;

    const formattedStartDate = moment(req.body.Reservation_Start).format(
      "MMMM D, YYYY"
    );
    const formattedEndDate = moment(req.body.Reservation_End).format(
      "MMMM D, YYYY"
    );

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.body.Model + " " + req.body.Brand,
            description: `Reservation from ${formattedStartDate} to ${formattedEndDate} at ${req.body.Pickup_location}`,
          },
          unit_amount: totalCost * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.body.Email,
      mode: "payment",
      success_url: "http://localhost:3000/checkout/success",
      cancel_url: "http://localhost:3000",
      line_items: lineItems,
    });
    const result = await pool.query(
      `INSERT INTO tblOrders (OrderID, CustomerID, CarID, Reservation_Start, Reservation_End, Pickup_Location, Total_Cost, First_Name, Last_Name, Email, CarName) 
       VALUES ('${userID}', '${req.body.UserId}', '${req.body.CarID}', '${
        req.body.Reservation_Start
      }', '${req.body.Reservation_End}', '${req.body.Pickup_location}', 
               ${totalCost}, '${req.body.First_Name}', '${
        req.body.Last_Name
      }', '${req.body.Email}', '${req.body.Model + " " + req.body.Brand}')`
    );

    if (result.rowsAffected > 0) {
      await pool.query(
        `UPDATE tblCars
         SET Rented = 1 , DateRented = '${req.body.Reservation_End}'
         WHERE CarID = '${req.body.CarID}'`
      );
    }
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM tblUsers WHERE username = @username");

    if (result.recordset.length > 0) {
      const foundUser = result.recordset[0];
      const storedHashedPassword = foundUser.password;

      const passwordsMatch = await bcrypt.compare(
        password,
        storedHashedPassword
      );

      if (passwordsMatch) {
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
              roles: foundUser.roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10s" }
        );
        const refreshToken = jwt.sign(
          { username: foundUser.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        await pool
          .request()
          .input("username", sql.VarChar, foundUser.username)
          .input("refreshToken", sql.VarChar, refreshToken)
          .query(
            "UPDATE tblUsers SET refreshToken = @refreshToken WHERE username = @username"
          );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken, roles: foundUser.roles });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
});

function sendConfirmationEmail(email) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "gherman.robert01@gmail.com",
      pass: "tiis rgtf ggdt ikjl",
    },
  });

  const mailOptions = {
    from: "gherman.robert01@gmail.com",
    to: email,
    subject: "Email Confirmation",
    html: `<p>Thank you for registering! You have created an account on the site <a href="http://localhost:3000/home">Click here to visit the site</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent!");
    }
  });
}
app.post("/api/register", async (req, res) => {
  const { username, password, email } = req.body;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
  const isValidPassword = passwordRegex.test(password);

  if (!isValidPassword) {
    res.status(400).json({ message: "Invalid password format" });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userID = uuid.v4();
    const token = uuid.v4();
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userID", sql.VarChar, userID)
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, hashedPassword)
      .input("token", sql.VarChar, token)
      .query(
        "INSERT INTO tblUsers (userID, username, password, token) VALUES (@userID, @username, @password, @token)"
      );
    sendConfirmationEmail(email);
    res.status(200).send("Data inserted successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/available-cars", async (req, res) => {
  const { start, end } = req.body;
  try {
    const pool = await sql.connect(config);

    const result = await pool.query(`
      SELECT *
      FROM tblCars
      WHERE CarID NOT IN (
        SELECT CarID
        FROM tblOrders
        WHERE (Reservation_Start <= '${end}' AND Reservation_End >= '${start}')
          
      )
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      return res.sendStatus(401);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(406).json({ message: "Unauthorized" });
        } else {
          const userCredentials = {
            username: decoded.username,
            email: decoded.email,
          };

          const accessToken = jwt.sign(
            userCredentials,
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );

          try {
            const pool = await sql.connect(config);
            await pool
              .request()
              .input("refreshToken", sql.VarChar, refreshToken)
              .query(
                "UPDATE tblUsers SET refreshToken = @refreshToken WHERE refreshToken = @refreshToken"
              );

            return res.json({ accessToken });
          } catch (dbError) {
            console.error(
              "Error updating refreshToken in the database:",
              dbError.message
            );
            return res.status(500).json({ message: "Server error" });
          }
        }
      }
    );
  } catch (err) {
    console.error("Error refreshing token:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/user", async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.json({ message: "User not logged in" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(406).json({ message: "Unauthorized" });
        }

        const userCredentials = {
          username: decoded.username,
          email: decoded.email,
          userID: decoded.userID,
        };

        const accessToken = jwt.sign(
          userCredentials,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "10m",
          }
        );

        try {
          const pool = await sql.connect(config);
          const userQueryResult = await pool
            .request()
            .input("username", sql.VarChar, userCredentials.username)
            .query(
              "SELECT userID, username, password, roles FROM tblUsers WHERE username = @username"
            );

          if (userQueryResult.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          const user = userQueryResult.recordset[0];

          const userResponse = {
            username: user.username,
            accessToken: accessToken,
            userID: user.userID,
            roles: user.roles,
          };

          return res.json(userResponse);
        } catch (dbError) {
          console.error("Error querying the database:", dbError.message);
          return res.status(500).json({ message: "Server error" });
        }
      }
    );
  } catch (err) {
    console.error("Error retrieving user data:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.sendStatus(204);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        try {
          const pool = await sql.connect(config);
          await pool
            .request()
            .input("refreshToken", sql.VarChar, refreshToken)
            .query(
              "UPDATE tblUsers SET refreshToken = NULL WHERE refreshToken = @refreshToken"
            );

          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
          return res.sendStatus(204);
        } catch (dbError) {
          console.error(
            "Error updating refreshToken in the database:",
            dbError.message
          );
          return res.status(500).json({ message: "Server error" });
        }
      }
    );
  } catch (err) {
    console.error("Error logging out:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/getOrders", async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const pool = await sql.connect(config);
        const result = await pool
          .request()
          .input("refreshToken", sql.VarChar, refreshToken)
          .query(
            `SELECT userID 
          FROM tblUsers
          WHERE refreshToken = @refreshToken`
          );

        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const userID = result.recordset[0].userID;

        const ordersResult = await pool
          .request()
          .input("userID", sql.VarChar, userID)
          .query(
            `SELECT * 
          FROM tblOrders
          WHERE CustomerID = @userID`
          );

        res.json(ordersResult.recordset);
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.post("/api/add-to-wishlist", async (req, res) => {
  try {
    const { carName, carModel } = req.body;
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const pool = await sql.connect(config);

        const userQueryResult = await pool
          .request()
          .input("refreshToken", sql.VarChar, refreshToken)
          .query(
            "SELECT Favorites FROM tblUsers WHERE refreshToken = @refreshToken"
          );

        const currentFavorites = userQueryResult.recordset[0]?.Favorites || "";

        const newFavorite = `${carName} ${carModel}`;
        const newFavorites = currentFavorites.includes(newFavorite)
          ? currentFavorites
          : currentFavorites + (currentFavorites ? ";" : "") + newFavorite;

        await pool
          .request()
          .input("refreshToken", sql.VarChar, refreshToken)
          .input("newFavorites", sql.VarChar, newFavorites)
          .query(
            "UPDATE tblUsers SET Favorites = @newFavorites WHERE refreshToken = @refreshToken"
          );

        res.status(200).json({ message: "Car added to wishlist" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/getFavorites", async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err);
          return res.status(401).json({ message: "Unauthorized" });
        }

        try {
          const pool = await sql.connect(config);
          const result = await pool
            .request()
            .input("refreshToken", sql.VarChar, refreshToken)
            .query(
              "SELECT Favorites FROM tblUsers WHERE refreshToken = @refreshToken"
            );

          if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          const favorites = result.recordset[0].Favorites;

          const favoriteList = favorites
            ? favorites.split(";").filter(Boolean)
            : [];

          res.json(favoriteList);
        } catch (dbError) {
          console.error("Database query error:", dbError);
          res.status(500).json({
            message: "An error occurred while processing your request.",
          });
        }
      }
    );
  } catch (err) {
    console.error("General error:", err);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});
app.get("/api/getCarID", async (req, res) => {
  try {
    const { carName } = req.query;

    const [brand, model] = carName.split(" ");

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("brand", sql.VarChar, brand)
      .input("model", sql.VarChar, model)
      .query(
        "SELECT CarID FROM tblCars WHERE Brand = @brand AND Model = @model"
      );

    const carID = result.recordset[0]?.CarID || null;

    res.json({ carID });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.post("/api/removeFromFavorites", async (req, res) => {
  try {
    const { carName } = req.body;
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        try {
          const pool = await sql.connect(config);

          const userQueryResult = await pool
            .request()
            .input("refreshToken", sql.VarChar, refreshToken)
            .query(
              "SELECT Favorites FROM tblUsers WHERE refreshToken = @refreshToken"
            );

          const currentFavorites =
            userQueryResult.recordset[0]?.Favorites || "";

          const updatedFavorites = currentFavorites
            .split(";")
            .filter((name) => name !== carName)
            .join(";");

          await pool
            .request()
            .input("refreshToken", sql.VarChar, refreshToken)
            .input("updatedFavorites", sql.VarChar, updatedFavorites)
            .query(
              "UPDATE tblUsers SET Favorites = @updatedFavorites WHERE refreshToken = @refreshToken"
            );

          res.status(200).json({ message: "Car removed from favorites" });
        } catch (dbError) {
          console.error("Database query error:", dbError);
          res.status(500).json({
            message: "An error occurred while processing your request.",
          });
        }
      }
    );
  } catch (err) {
    console.error("General error:", err);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

app.get("/api/update-rented-status", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const ordersCountQuery = await pool.query(`
      SELECT COUNT(*) AS OrdersCount
      FROM tblOrders
    `);

    const ordersCount = ordersCountQuery.recordset[0].OrdersCount;

    if (ordersCount === 0) {
      return;
    }

    const carsToUpdate = await pool.query(`
      SELECT CarID, Reservation_End
      FROM tblOrders
    `);

    const currentDate = new Date();

    for (const car of carsToUpdate.recordset) {
      const reservationEndDate = new Date(car.Reservation_End);
      if (reservationEndDate <= currentDate) {
        await pool.query(`
          UPDATE tblCars
          SET Rented = 0
          WHERE CarID = '${car.CarID}'
        `);
        await pool.query(`
          DELETE FROM tblOrders
          WHERE CarID = '${car.CarID}'
        `);
      }
    }
  } catch (err) {
    console.error("Error updating rented status:", err.message);
  }
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "D:/proiecte vs/fastcars/fastcar/DBfiles/uploaded_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/api/add-car", upload.single("CarImage"), async (req, res) => {
  try {
    const newCarData = req.body;
    const carImageDetails = req.file;

    const pool = await sql.connect(config);

    const maxCarIDQuery = `SELECT MAX(CarID) AS MaxCarID FROM tblCars`;
    const maxCarIDResult = await pool.request().query(maxCarIDQuery);
    const maxCarID = maxCarIDResult.recordset[0].MaxCarID;

    const newCarID = maxCarID + 1;

    const insertQuery = `
      INSERT INTO tblCars (CarID, City, Type, Capacity, Brand, Model, Options, Rented, CarImage, Description, Price, Engine, Horsepower, AccelerationTime, TopSpeed, Address)
      VALUES (@CarID, @City, @Type, @Capacity, @Brand, @Model, @Options, @Rented, (SELECT * FROM OPENROWSET(BULK N'${carImageDetails.path}', SINGLE_BLOB) AS image), @Description, @Price, @Engine, @Horsepower, @AccelerationTime, @TopSpeed, @Address);
    `;

    const result = await pool
      .request()
      .input("CarID", sql.Int, newCarID)
      .input("City", sql.VarChar, newCarData.City)
      .input("Type", sql.VarChar, newCarData.Type)
      .input("Capacity", sql.VarChar, newCarData.Capacity)
      .input("Brand", sql.VarChar, newCarData.Brand)
      .input("Model", sql.VarChar, newCarData.Model)
      .input("Options", sql.VarChar, newCarData.Options)
      .input("Rented", sql.Bit, newCarData.Rented === "true")
      .input("Description", sql.VarChar, newCarData.Description)
      .input("Price", sql.Decimal, newCarData.Price)
      .input("Engine", sql.VarChar, newCarData.Engine)
      .input("Horsepower", sql.VarChar, newCarData.Horsepower)
      .input("AccelerationTime", sql.VarChar, newCarData.AccelerationTime)
      .input("TopSpeed", sql.VarChar, newCarData.TopSpeed)
      .input("Address", sql.VarChar, newCarData.Address)
      .query(insertQuery);

    if (result.rowsAffected > 0) {
      res.status(201).json({ message: "Car added successfully" });
    } else {
      res.status(500).json({ message: "Failed to add car" });
    }
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/delete-car/:carID", async (req, res) => {
  try {
    const { carID } = req.params;

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("CarID", sql.VarChar, carID)
      .query("DELETE FROM tblCars WHERE CarID = @CarID");

    if (result.rowsAffected > 0) {
      res.status(200).json({ message: "Car deleted successfully" });
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (err) {
    console.error("Error deleting car:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(5000, () => console.log("Server is running on port 5000"));
