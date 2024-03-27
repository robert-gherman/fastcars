import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import AuthContext from "../../context/AuthProvider";

async function loginUser(credentials) {
  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        username,
        password,
      });
      if (response?.accessToken) {
        setAuth({
          username,
          password,
          accessToken: response.accessToken,
          roles: response.roles,
        });

        navigate("/");
      } else {
        console.log("Login failed.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
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
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between flex-col">
            <button type="submit" className="submit">
              Login
            </button>
            <div className="buttons-container">
              <Link to="/register" className="link">
                New here? SIGN UP
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
