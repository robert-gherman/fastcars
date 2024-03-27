import React from "react";

import logo from "../images/logo.png";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

const Footer = () => {
  return (
    <div className="footer-container">
      <img
        src={logo}
        alt="footer image"
        className="footer-image"
        style={{ width: "50px", height: "50px" }}
      />
      <p className="footer-text" style={{ fontSize: "15px" }}>
        @2022 FastCars All Rights Reserved.
      </p>
      <div className="footer-info-container">
        <div className="phone-container">
          <BsTelephone style={{ color: "white" }} />
          <p className="footer-info-text">Phone: 555-555-5555</p>
        </div>
        <div className="location-container">
          <HiOutlineLocationMarker style={{ color: "white" }} />
          <p className="footer-info-text">Location: 123 Main Street</p>
        </div>
        <div className="mail-container">
          <MdOutlineMail style={{ color: "white" }} />
          <p className="footer-info-text">Email: info@fastcars.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
