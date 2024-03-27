import React, { useState, useEffect } from "react";
import { BsTrash } from "react-icons/bs";

const CarsListAdmin = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data");
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        } else {
          console.error("Failed to fetch cars data.");
        }
      } catch (error) {
        console.error("Error fetching cars data:", error);
      }
    };

    fetchCars();
  }, []);

  const handleDeleteCar = async (carID) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/delete-car/${carID}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setCars((prevCars) => prevCars.filter((car) => car.CarID !== carID));
      } else {
        console.error("Failed to delete car.");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="cars-list">
      <h2 style={{ margin: "10px 0" }}>All Cars</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Brand</th>
            <th className="table-header">Model</th>
            <th className="table-header">Type</th>
            <th className="table-header">Capacity</th>
            <th className="table-header">Options</th>
            <th className="table-header">Price</th>
            <th className="table-header">Delete</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.CarID}>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                {car.CarID}
              </td>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                {car.Brand}
              </td>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                {car.Model}
              </td>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                {car.Type}
              </td>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                {car.Capacity}
              </td>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                {car.Options}
              </td>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                {car.Price}
              </td>
              <td
                style={{ padding: "12px 8px", borderBottom: "1px solid #ddd" }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteCar(car.CarID)}
                >
                  <BsTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarsListAdmin;
