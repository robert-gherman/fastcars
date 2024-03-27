import React, { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { ROLES } from "../App";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import "../styles/sidebar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import useLogout from "../hooks/useLogout";
import Orders from "./Orders";
import Favorites from "./Favorites";
import useAuth from "../hooks/useAuth";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const sidebarRef = useRef(null);

  const [users, setUsers] = useState([]);
  const logout = useLogout();
  const { auth, setAuth } = useAuth();
  const [showOrders, setShowOrders] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const checkUserLoggedIn = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!data.username) {
        setIsLoggedIn(false);
      } else if (data.username) {
        setIsLoggedIn(true);
        setUsers([data]);
        setAuth(data);
      }
    } catch (error) {
      console.log("Error:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  const signOut = async () => {
    await logout();
    setIsLoggedIn(false);
    setUsers([]);
  };
  console.log("auth:", auth);
  return (
    <div className="sidebar" ref={sidebarRef}>
      <button
        aria-label="open sidebar"
        className={`burger-button ${isSidebarOpen ? "open" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          setIsSidebarOpen(!isSidebarOpen);
        }}
        style={{ zIndex: "6" }}
      >
        {isSidebarOpen ? (
          <AiOutlineArrowLeft size={48} />
        ) : (
          <GiHamburgerMenu size={48} />
        )}
      </button>

      <div className={`sidebar ${isSidebarOpen ? "openSidebar" : ""}`}>
        {isSidebarOpen ? (
          <ul className="sidebar-container" style={{ position: "relative" }}>
            <li>
              <div
                to="/favorites"
                className="zoo-link"
                onClick={() => setShowFavorites(!showFavorites)}
              >
                {showFavorites ? <IoIosArrowDown /> : <IoIosArrowForward />}
                <div className="sidebar-text">Favorites</div>
              </div>
              {isLoggedIn && showFavorites ? <Favorites /> : null}
            </li>
            <li>
              <div
                to="/orders"
                className="zoo-link"
                onClick={() => setShowOrders(!showOrders)}
              >
                {showOrders ? <IoIosArrowDown /> : <IoIosArrowForward />}
                <div className="sidebar-text">Orders</div>
              </div>
              {isLoggedIn && showOrders ? <Orders /> : null}
            </li>
            <li>
              {users[0]?.roles?.includes(ROLES.Admin) ? (
                <Link to="/admin">Admin</Link>
              ) : null}
            </li>
          </ul>
        ) : null}
        {isLoggedIn && isSidebarOpen ? (
          <div
            className="signout-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              width: "100%",
              marginBottom: "50px",
            }}
          >
            <button className="signout-btn" onClick={signOut}>
              Sign Out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;
