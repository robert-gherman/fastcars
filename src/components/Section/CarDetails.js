import React from "react";
import Footer from "../../Scenes/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import axios from "../../api/axios";
import { AiTwotoneHeart } from "react-icons/ai";

const CarDetails = ({ data, setData, isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [isHeartPressed, setIsHeartPressed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [value, setValue] = useState("description");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const API_ENDPOINT = "http://localhost:5000/api/data";
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(API_ENDPOINT);
      const data1 = await res.json();
      setData(data1);
    };

    fetchData();
  }, []);
  const addToWishlist = async (carName, carModel) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/add-to-wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ carName, carModel }),
        }
      );

      if (response.ok) {
        setFavorites([...favorites, carName]);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <div className="div">
      {/* <Navbar /> */}
      <Box width="80%" m="80px auto">
        <Box display="flex" flexWrap="wrap" columnGap="40px">
          {/* IMAGES */}
          <Box flex="1 1 40%" mb="40px">
            {data ? (
              <img
                src={
                  "data:image/png;base64," +
                  Buffer.from(data[itemId - 1].CarImage, "binary").toString(
                    "base64"
                  )
                }
                alt=""
                width="100%"
                height="100%"
                style={{ objectFit: "contain" }}
              />
            ) : null}
          </Box>

          {/* ACTIONS */}
          <Box flex="1 1 50%" mb="40px">
            <Box display="flex" justifyContent="space-between">
              <button
                onClick={() => navigate(`/`)}
                style={{
                  textDecoration: "none",
                  all: "unset",
                  cursor: "pointer",
                }}
              >
                Home
              </button>
              <button
                onClick={() => {
                  if (data && data[itemId - 1]?.CarID > 1) {
                    navigate(`/item/${data[itemId - 1]?.CarID - 1}`);
                  }
                }}
                style={{
                  textDecoration: "none",
                  all: "unset",
                  cursor: "pointer",
                  marginLeft: "450px",
                }}
              >
                Prev
              </button>
              <button
                onClick={() => {
                  if (data && data[itemId - 1]?.CarID + 1 < data.length + 1) {
                    navigate(`/item/${data[itemId - 1]?.CarID + 1}`);
                  }
                }}
                style={{
                  textDecoration: "none",
                  all: "unset",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </Box>
            <Box m="65px 0 25px 0">
              <Typography variant="h3">
                {data ? data[itemId - 1]?.Brand : null}
              </Typography>

              <Typography variant="h3" sx={{ mt: "10px" }}>
                {data ? data[itemId - 1]?.Model : null}
              </Typography>
              <Typography variant="h6" sx={{ mt: "20px" }}>
                {data ? data[itemId - 1]?.Description : null}
              </Typography>
              <Typography>
                ${data ? data[itemId - 1]?.Price : null}/Day
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" minHeight="50px">
              {/* <Box
                display="flex"
                alignItems="center"
                border={`1.5px solid ${shades.neutral[300]}`}
                mr="20px"
                p="2px 5px"
              ></Box> */}
              {data && data[itemId - 1]?.Rented === 0 ? (
                <Button
                  sx={{
                    backgroundColor: "#222222",
                    color: "grey",
                    borderRadius: 0,
                    minWidth: "150px",
                    padding: "10px 40px",
                  }}
                  onClick={() => navigate(`/Checkout/${itemId}`)}
                >
                  RENT THE CAR
                </Button>
              ) : (
                <Typography
                  sx={{
                    backgroundColor: "#FF0000",
                    color: "white",
                    borderRadius: 0,
                    minWidth: "150px",
                    padding: "10px 40px",
                    textAlign: "center",
                  }}
                >
                  RENTED OUT
                </Typography>
              )}
            </Box>
            <Box>
              <Box
                m="20px 0 5px 0"
                display="flex"
                style={{ alignContent: "flex" }}
              >
                <IconButton
                  onClick={() => {
                    addToWishlist(
                      data ? data[itemId - 1]?.Brand : null,
                      data ? data[itemId - 1]?.Model : null
                    );
                    setIsHeartPressed(!isHeartPressed);
                  }}
                >
                  {!isHeartPressed ? (
                    <FavoriteBorderOutlinedIcon />
                  ) : (
                    <AiTwotoneHeart />
                  )}
                </IconButton>
                <Typography
                  sx={{ ml: "5px" }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  ADD TO WISHLIST
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default CarDetails;
