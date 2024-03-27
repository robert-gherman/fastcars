import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/Login.css";

async function registerUser(credentials) {
  return fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default function Register({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [email, setEmail] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (formSubmitted && passwordsMatch) {
      navigate("/login");
    }
  }, [formSubmitted, passwordsMatch, navigate]);

  const validatePassword = (pass) => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;
    return passwordRegex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    if (!validatePassword(password)) {
      console.error("Password validation failed.");
      return;
    }

    setPasswordsMatch(true);
    setFormSubmitted(true);

    const token = await registerUser({
      username,
      password,
      email,
    });
  };

  return (
    <div className="login-page" style={{ backgroundColor: "#1c1c1c" }}>
      <div className="login-container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">Username</label>
            <input
              className="input"
              name="username"
              placeholder="Type username..."
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Type email..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label className="label">
              Password{" "}
              <span className="password-hint">
                (Min. 6 chars, 1 number, 1 special char)
              </span>
            </label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label className="label">Confirm Password</label>
            <input
              className="input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {!passwordsMatch && (
            <div className="mb-4 text-red-500" style={{ color: "red" }}>
              Passwords do not match.
            </div>
          )}
          <div className="flex justify-between flex-col">
            <button type="submit" className="submit">
              Register
            </button>
            <div className="buttons-container">
              <Link to="/login" className="link">
                Already have an account?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
