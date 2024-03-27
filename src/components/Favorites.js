import React, { useState, useEffect } from "react";
import { ImBin } from "react-icons/im";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedCarID, setSelectedCarID] = useState(null);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getFavorites", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleCarNameClick = async (carName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/getCarID?carName=${carName}`
      );
      const data = await response.json();
      const carID = data.carID;

      window.location.href = `/item/${carID}`;
    } catch (error) {
      console.error("Error fetching car ID:", error);
    }
  };

  const handleRemoveCar = async (carName) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/removeFromFavorites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ carName }),
        }
      );

      if (response.status === 200) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((name) => name !== carName)
        );
      }
    } catch (error) {
      console.error("Error removing car from favorites:", error);
    }
  };

  return (
    <div className="favorites-container" style={{ color: "#ab6c1f" }}>
      <ul
        className="ul-favorites"
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        {favorites.map((carName) => (
          <li
            key={carName}
            style={{
              marginTop: "9px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span onClick={() => handleCarNameClick(carName)}>{carName}</span>
            <ImBin onClick={() => handleRemoveCar(carName)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
