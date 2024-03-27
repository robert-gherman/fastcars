import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = ({ userID }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getOrders", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log(response.data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userID]);

  const formatReservationDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    });
  };

  return (
    <div
      className="orders-container"
      style={{
        color: "#ab6c1f",
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        {orders.map((order) => (
          <li key={order.OrderID} style={{ marginBottom: "10px" }}>
            <p style={{ marginBottom: "10px" }}>Car: {order.CarName}</p>
            <div className="datesOrder-container" style={{ display: "flex" }}>
              <p style={{ marginRight: "5px" }}>
                Start: {formatReservationDate(order.Reservation_Start)}
              </p>
              <p>End: {formatReservationDate(order.Reservation_End)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
