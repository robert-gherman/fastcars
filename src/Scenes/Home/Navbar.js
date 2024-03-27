import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import {
  AiOutlineInstagram,
  AiOutlineFacebook,
  AiOutlineYoutube,
} from "react-icons/ai";
import logo from "../../images/logo.png";
import Users from "../../components/Users.js";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const checkUserLoggedIn = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!data.username) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        setUserData(data);
      }
    } catch (error) {
      console.log("Error:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  return (
    <div className="container">
      <div className="content">
        <ul>
          <div className="telephone-content">
            <BsTelephone size="26px" color="white" />
            <div className="telephone-innerContent">
              <li>
                <a href="#">Telephone</a>
              </li>
              <p style={{ color: "white" }}>+48 501 140 391</p>
            </div>
          </div>
          <li>
            <img src={logo} />
          </li>
          <li>
            <div className="email-content">
              <div className="email-innerContent">
                <a href="#">Email</a>
                <p style={{ color: "white" }}>something@email</p>
              </div>

              <MdOutlineMail size="36px" color="white" />
            </div>
          </li>
        </ul>

        {isLoggedIn ? (
          <>
            <div className="username-wrap">
              <Users onError={() => setIsLoggedIn(false)} userData={userData} />
            </div>
          </>
        ) : (
          <div className="username-wrap">
            <button className="login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="singup" onClick={() => navigate("/register")}>
              Sign up
            </button>
          </div>
        )}
      </div>
      <div className="secondNav-container">
        <ul className="second-navbar">
          <li>
            <Link to="/">Cars</Link>
          </li>
          <li>
            <Link to="/about">Information</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact Us</Link>
          </li>
        </ul>
        <div className="icon-links">
          <AiOutlineInstagram size="34px" />
          <AiOutlineFacebook size="34px" />
          <AiOutlineYoutube size="34px" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
