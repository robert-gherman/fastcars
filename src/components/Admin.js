import React, { useState } from "react";
import "../styles/admin.css";
import AddCarForm from "./AddCarForm";
import CarsListAdmin from "./CarsListAdmin";

const Admin = () => {
  const [showAddCarForm, setShowAddCarForm] = useState(false);

  const handleShowAddCarForm = () => {
    setShowAddCarForm(true);
  };

  const handleShowAllCars = () => {
    setShowAddCarForm(false);
  };

  return (
    <section className="admin-section">
      <h1 className="admin-title">Admin's Page</h1>
      {showAddCarForm ? (
        <AddCarForm onAddCar={handleShowAllCars} />
      ) : (
        <div>
          <button className="add-button" onClick={handleShowAddCarForm}>
            Insert a car
          </button>
          <CarsListAdmin />
        </div>
      )}
    </section>
  );
};

export default Admin;
