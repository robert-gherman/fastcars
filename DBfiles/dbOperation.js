const config = require("./dbConfig"),
  sql = require("mssql");

const getCars = async () => {
  try {
    let pool = await sql.connect(config);
    let cars = await pool.request().query("SELECT * from tblCars");
    return cars;
  } catch (error) {}
};

module.exports = {
  getCars,
};
