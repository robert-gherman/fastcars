import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const AddCarForm = ({ onAddCar }) => {
  const [carInfo, setCarInfo] = useState({
    City: "",
    Type: "",
    Capacity: "",
    Brand: "",
    Model: "",
    Options: "",
    Rented: "",
    DateRented: null,
    CarImage: null,
    Description: "",
    Price: "",
    Engine: "",
    Horsepower: "",
    AccelerationTime: "",
    TopSpeed: "",
    Address: "",
  });

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    if (type === "file" && name === "CarImage") {
      setCarInfo((prevInfo) => ({
        ...prevInfo,
        CarImage: event.target.files[0],
      }));
    } else {
      setCarInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("City", carInfo.City);
    formData.append("Type", carInfo.Type);
    formData.append("Capacity", carInfo.Capacity);
    formData.append("Brand", carInfo.Brand);
    formData.append("Model", carInfo.Model);
    formData.append("Options", carInfo.Options);
    formData.append("Rented", carInfo.Rented);
    formData.append("DateRented", carInfo.DateRented);
    formData.append("CarImage", carInfo.CarImage);
    formData.append("Description", carInfo.Description);
    formData.append("Price", carInfo.Price);
    formData.append("Engine", carInfo.Engine);
    formData.append("Horsepower", carInfo.Horsepower);
    formData.append("AccelerationTime", carInfo.AccelerationTime);
    formData.append("TopSpeed", carInfo.TopSpeed);
    formData.append("Address", carInfo.Address);

    try {
      const response = await fetch("http://localhost:5000/api/add-car", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setCarInfo({
          City: "",
          Type: "",
          Capacity: "",
          Brand: "",
          Model: "",
          Options: "",
          Rented: "",
          DateRented: null,
          CarImage: null,
          Description: "",
          Price: "",
          Engine: "",
          Horsepower: "",
          AccelerationTime: "",
          TopSpeed: "",
          Address: "",
        });
        alert("Car added successfully!");
      } else {
        alert("Failed to add car.");
      }
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="Capacity"
        placeholder="How many seats"
        value={carInfo.Capacity}
        onChange={handleInputChange}
      />
      <select name="City" value={carInfo.City} onChange={handleInputChange}>
        <option value="">Select City</option>
        <option value="Arad">Arad</option>
        <option value="Timisoara">Timisoara</option>
        <option value="Cluj-Napoca">Cluj-Napoca</option>
      </select>
      <select name="Type" value={carInfo.Type} onChange={handleInputChange}>
        <option value="">Select Type</option>
        <option value="Diesel">Diesel</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Electric">Electric</option>
        <option value="Gasoline">Gasoline</option>
      </select>
      <input
        type="text"
        name="Brand"
        placeholder="Brand"
        value={carInfo.Brand}
        onChange={handleInputChange}
      />

      <input
        type="text"
        name="Model"
        placeholder="Model"
        value={carInfo.Model}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="Options"
        placeholder="Options"
        value={carInfo.Options}
        onChange={handleInputChange}
      />
      <div className="admin-input">
        <label style={{ marginRight: "15px" }}>Rented</label>
        <select
          name="Rented"
          value={carInfo.Rented}
          onChange={handleInputChange}
        >
          <option value={false}>False</option>
          <option value={true}>True</option>
        </select>
      </div>

      {carInfo.Rented === "true" && (
        <div className="admin-input">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="DateRented"
              value={carInfo.DateRented}
              onChange={(date) => setCarInfo({ ...carInfo, DateRented: date })}
              className="daterented"
            />
          </LocalizationProvider>
        </div>
      )}

      <input
        type="file"
        name="CarImage"
        accept="image/*"
        onChange={handleInputChange}
        style={{ maxHeight: "37px" }}
      />

      <textarea
        name="Description"
        placeholder="Description"
        value={carInfo.Description}
        onChange={handleInputChange}
        rows="3"
        color="white"
        className="white-textarea"
      />
      <input
        type="text"
        name="Price"
        placeholder="Price in Euros (€)"
        value={carInfo.Price}
        onChange={handleInputChange}
        inputMode="numeric"
        pattern="[0-9]*"
        style={{ maxHeight: "37px" }}
      />
      <input
        type="text"
        name="Address"
        placeholder="Address"
        value={carInfo.Address}
        onChange={handleInputChange}
      />
      <div className="input-group">
        <label>-Engine</label>
        <div className="input-container">
          <input
            type="text"
            name="Engine"
            placeholder="Engine"
            value={carInfo.Engine}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="input-group">
        <label>-Horsepower</label>
        <div className="input-container">
          <input
            type="text"
            name="Horsepower"
            placeholder="Horsepower"
            value={carInfo.Horsepower}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="input-group">
        <label>-Acceleration Time</label>
        <div className="input-container">
          <input
            type="text"
            name="AccelerationTime"
            placeholder="Acceleration Time"
            value={carInfo.AccelerationTime}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="input-group">
        <label>-Top Speed</label>
        <div className="input-container">
          <input
            type="text"
            name="TopSpeed"
            placeholder="Top Speed"
            value={carInfo.TopSpeed}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="btn-admin-container">
        <button className="add-button" type="submit">
          Add Car
        </button>

        <button className="add-button" type="button" onClick={onAddCar}>
          Go Back to Menu
        </button>
      </div>
    </form>
  );
};

export default AddCarForm;
