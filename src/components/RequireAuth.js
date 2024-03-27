import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ROLES from "../App";
import axios from "../api/axios";
import { useEffect } from "react";
const RequireAuth = ({ allowedRoles }) => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setAuth(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);
  if (!auth?.roles) {
    return <div>Loading</div>;
  }
  return auth?.roles?.includes("5050") ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
