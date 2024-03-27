import React, { useState } from "react";
import Footer from "../../Scenes/Footer";
import "../../styles/contact.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faMapMarker,
  faPaperPlane,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.elements.name.value = "";
    e.target.elements.email.value = "";
    e.target.elements.message.value = "";
  };

  return (
    <div className="contact-us-container">
      <section id="contact">
        <h1 className="section-header-contact">Contact</h1>

        <div className="contact-wrapper">
          <form
            id="contact-form"
            style={{ display: "flex", flexDirection: "column" }}
            role="form"
          >
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="NAME"
                name="name"
                style={{
                  marginBottom: "10px",
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="EMAIL"
                name="email"
                style={{
                  marginBottom: "10px",
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                required
              />
            </div>
            <textarea
              className="form-control"
              rows="10"
              placeholder="MESSAGE"
              name="message"
              style={{
                marginBottom: "10px",
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            ></textarea>

            <button
              className="send-button"
              id="submit"
              type="submit"
              value="SEND"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <div className="alt-send-button">
                <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
                <span className="send-text">SEND</span>
              </div>
            </button>
          </form>

          <div className="direct-contact-container">
            <ul className="contact-list">
              <li className="list-item">
                <FontAwesomeIcon icon={faMapMarker} className="fa-2x" />
                <span className="contact-text place">City, State</span>
              </li>

              <li className="list-item">
                <FontAwesomeIcon icon={faPhone} className="fa-2x" />
                <span className="contact-text phone">
                  <a href="tel:1-212-555-5555" title="Give me a call">
                    (212) 555-2368
                  </a>
                </span>
              </li>

              <li className="list-item">
                <FontAwesomeIcon icon={faEnvelope} className="fa-2x" />
                <span className="contact-text gmail">
                  <a href="mailto:#" title="Send me an email">
                    hitmeup@gmail.com
                  </a>
                </span>
              </li>
            </ul>

            <hr />

            <ul className="social-media-list">
              <li style={{ display: "inline-block", marginRight: "10px" }}>
                <a href="#" target="_blank" className="contact-icon">
                  <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                </a>
              </li>
              <li style={{ display: "inline-block", marginRight: "10px" }}>
                <a href="#" target="_blank" className="contact-icon">
                  <FontAwesomeIcon icon={faFacebook} aria-hidden="true" />
                </a>
              </li>
              <li style={{ display: "inline-block", marginRight: "10px" }}>
                <a href="#" target="_blank" className="contact-icon">
                  <FontAwesomeIcon icon={faYoutube} aria-hidden="true" />
                </a>
              </li>
              <li style={{ display: "inline-block", marginRight: "10px" }}>
                <a href="#" target="_blank" className="contact-icon">
                  <FontAwesomeIcon icon={faTelegram} aria-hidden="true" />
                </a>
              </li>
            </ul>

            <hr />

            <div className="copyright">&copy; ALL OF THE RIGHTS RESERVED</div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Contact;
