import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/users.css";
const Users = ({ userData }) => {
  const navigate = useNavigate();

  return (
    <>
      {userData ? (
        <button
          className="user-button"
          onClick={() => navigate(`/user/${userData?.username}`)}
        >
          {userData?.username}
        </button>
      ) : (
        <p>No users to display</p>
      )}
    </>
  );
};

export default Users;
