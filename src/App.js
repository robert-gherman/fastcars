import React from "react";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// components
import Home from "./Scenes/Home/Home";
import "./styles/app.css";
import About from "./Scenes/About/About.js";
import Contact from "./Scenes/Contact/Contact.js";
import CarDetails from "./components/Section/CarDetails";
import Checkout from "./Scenes/Checkout/Checkout.js";
import Confirmation from "./Scenes/Checkout/Confirmation.js";
import Login from "./Scenes/Login/Login.js";
import Register from "./Scenes/Register/Register.js";
import Admin from "./components/Admin.js";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import PersistLogin from "./components/PersistLogin";
import Navbar from "./Scenes/Home/Navbar";
import Sidebar from "./components/Sidebar";
import RequireAuth from "./components/RequireAuth.js";

const initialState = {
  data: {},
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  dataReducer: dataReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
export const ROLES = {
  User: 2001,
  Admin: 5050,
};

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <Provider store={store}>
      <div className="App">
        <ScrollToTop />
        {!isAuthRoute && (
          <>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Sidebar
              setIsSidebarOpen={setIsSidebarOpen}
              isSidebarOpen={isSidebarOpen}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </>
        )}
        <Routes>
          <Route element={<PersistLogin />}>
            <Route
              path="/"
              element={
                <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route
              path="item/:itemId"
              element={
                <CarDetails
                  data={data}
                  setData={setData}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
            <Route path="checkout/:itemId" element={<Checkout data={data} />} />
            <Route path="checkout/success" element={<Confirmation />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*PROTECTED ROUTE */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
