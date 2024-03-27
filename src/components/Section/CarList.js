import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import { BsFillPersonFill, BsSpeedometer2 } from "react-icons/bs";
import { RiCarFill } from "react-icons/ri";
import { GiHorseHead } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

async function fetchAvailableCars(startDate, endDate) {
  try {
    const response = await fetch(
      `${"http://localhost:5000/api"}/available-cars`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: startDate,
          end: endDate,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Error fetching available cars");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available cars:", error);
    throw error;
  }
}

function CarList({
  selectedCategory,
  selectedOption,
  selectedLocation,
  selectedBrand,
  minPrice,
  maxPrice,
}) {
  const API_ENDPOINT = "http://localhost:5000/api/data";
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState(null);
  const [showAllCars, setShowAllCars] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(API_ENDPOINT);
      const data1 = await res.json();
      setData(data1);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const availableCars = await fetchAvailableCars(startDate, endDate);
      setData(availableCars);
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
  };
  return (
    <div className="Carlist-container">
      <div className="search-bar-container" style={{ display: "flex" }}>
        <input
          className="search-bar"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <div className="date-picker-container" style={{ display: "flex" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              className="start"
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              className="end"
            />
          </LocalizationProvider>
        </div>
        <div
          className="btn-show-container"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {" "}
          <button
            onClick={() => setShowAllCars(!showAllCars)}
            className=" button-6 show-all-button"
            style={{
              position: "absolute",
              right: "0",
              marginRight: "15px",
              cursor: "pointer",
              whiteSpace: "normal",
              maxWidth: "150px",
              textAlign: "left",
            }}
          >
            {showAllCars ? "Show Available Cars Only" : "Show All Cars"}
          </button>
        </div>
      </div>
      <ul className="car-container">
        {data

          ?.filter((result) => {
            if (showAllCars || result.Rented === 0) {
              if (selectedLocation) {
                return (
                  (result.Brand.toLowerCase().includes(
                    searchTerm.toLowerCase()
                  ) ||
                    result.Model.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )) &&
                  selectedLocation
                    .toLowerCase()
                    .includes(result.City.toLowerCase())
                );
              }
              if (selectedOption) {
                const selectedOptionsArray = selectedOption
                  .toLowerCase()
                  .split(",")
                  .map((option) => option.trim())
                  .filter((option) => option !== "");
                const resultOptionsArray = result.Options.toLowerCase()
                  .split(",")
                  .map((option) => option.trim())
                  .filter((option) => option !== "");
                return selectedOptionsArray.every((option) =>
                  resultOptionsArray.includes(option)
                );
              }
              if (selectedBrand) {
                return (
                  (result.Brand.toLowerCase().includes(
                    searchTerm.toLowerCase()
                  ) ||
                    result.Model.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )) &&
                  selectedBrand
                    .toLowerCase()
                    .includes(result.Brand.toLowerCase())
                );
              }
              if (maxPrice) {
                return (
                  (result.Brand.toLowerCase().includes(
                    searchTerm.toLowerCase()
                  ) ||
                    result.Model.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )) &&
                  maxPrice >= result.Price &&
                  minPrice <= result.Price
                );
              } else {
                return (
                  result.Brand.toLowerCase().includes(
                    searchTerm.toLowerCase()
                  ) ||
                  result.Model.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }
            }
          })

          .map((item, index) => {
            return (
              <li
                style={{ width: "700px" }}
                onClick={() => navigate(`/item/${item.CarID}`)}
                key={item.CarID}
                className="car-item-container"
              >
                <img
                  src={
                    "data:image/png;base64," +
                    Buffer.from(item.CarImage.data, "binary").toString("base64")
                  }
                  alt=""
                  style={{ height: "190px", cursor: "pointer", width: "200px" }}
                />
                <div className="car-right">
                  <div
                    style={{
                      display: "flex",
                      gap: "0.25em",
                      alignItems: "center",
                    }}
                  >
                    <h3>{item.Brand} -</h3>
                    <p>{item.Model}</p>
                  </div>
                  <div className="carDescription-home-container">
                    <div className="firstPartdescription">
                      <div
                        className="capacityDesc-container"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <BsFillPersonFill
                          size={15}
                          style={{ marginRight: "5px" }}
                        />
                        <h1 style={{ fontWeight: "normal" }}>
                          {item.Capacity}
                        </h1>
                      </div>
                      <div
                        className="capacityDesc-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <RiCarFill size={15} style={{ marginRight: "5px" }} />
                        <h1 style={{ fontWeight: "normal" }}>{item.Engine}</h1>
                      </div>
                      <div
                        className="capacityDesc-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <GiHorseHead size={15} style={{ marginRight: "5px" }} />
                        <h1 style={{ fontWeight: "normal" }}>
                          {item.Horsepower}
                        </h1>
                      </div>
                    </div>

                    <div className="secondPartdescription">
                      <div
                        className="capacityDesc-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <TbManualGearbox
                          size={15}
                          style={{ marginRight: "5px" }}
                        />
                        <h1 style={{ fontWeight: "normal" }}>Automatic</h1>
                      </div>
                      <div
                        className="capacityDesc-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <h1 style={{ marginRight: "5px" }}>0-60</h1>
                        <h1 style={{ fontWeight: "normal" }}>
                          {item.AccelerationTime}
                        </h1>
                      </div>
                      <div
                        className="capacityDesc-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <BsSpeedometer2
                          size={15}
                          style={{ marginRight: "5px" }}
                        />
                        <h1 style={{ fontWeight: "normal" }}>
                          {item.TopSpeed}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="desc-location-container">
                    <h4>Location</h4>
                    <h5 className="desc-location-label">{item.City}</h5>
                    <h5 className="desc-location-label">{item.Address}</h5>
                  </div>
                </div>
                <div className="seeMoreDesc-container">
                  <h5>Price/day:</h5>
                  <h1 style={{ color: "#5da0d7" }}>{item.Price} €</h1>
                  <button type="button" className="car-button-desc">
                    {"See more >"}
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
export default CarList;
