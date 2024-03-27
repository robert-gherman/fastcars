import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { shades } from "../../theme";
import Payment from "./Payment";
import Shipping from "./Shipping";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment-timezone";
import { parsePhoneNumberFromString } from "libphonenumber-js";
const stripePromise = loadStripe(
  "pk_test_51MGUYTDOr8Rh3rU0YILDh1nI7eT4UcDM2nSQQTBzjTjskiIgcrcuYWYFht2m9DdJafjoqKSiQ1ntUwmOfFZyI9ES00egSWRnOb"
);
const Checkout = ({ data }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;
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
      }
    } catch (error) {
      console.log("Error:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  const itemid = useParams();

  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1);

    if (isSecondStep) {
      makePayment(values);
    }

    actions.setTouched({});
  };

  async function makePayment(values) {
    try {
      // TODO: oct 24 - oct 26 => 1 instead of 2
      const stripe = await stripePromise;
      const response = await fetch("http://localhost:5000/api/user", {
        method: "GET",
        credentials: "include",
      });

      const data2 = await response.json();
      var userResponseID = data2.userID;

      let reservationStart = moment(values.billingAddress.Reservation_Start).tz(
        "UTC"
      );
      let reservationEnd = moment(values.billingAddress.Reservation_End).tz(
        "UTC"
      );

      const numberOfDays = reservationEnd.diff(reservationStart, "days");

      console.log(numberOfDays);
      console.log(values);

      let aux = "";

      if (response.status === 200) {
        aux = JSON.stringify({
          CarID: data[itemid.itemId - 1].CarID,
          Reservation_Start: reservationStart.toISOString(),
          Reservation_End: reservationEnd.toISOString(),
          NumberOfDays: numberOfDays,
          Pickup_location: values.billingAddress.pickup_location,
          Total_Cost: data[itemid.itemId - 1].Price,
          First_Name: values.billingAddress.firstName,
          Last_Name: values.billingAddress.lastName,
          Email: values.email,
          Model: data[itemid.itemId - 1].Model,
          Brand: data[itemid.itemId - 1].Brand,
          UserId: isLoggedIn ? userResponseID : null,
        });
      }

      const responseOrder = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: aux,
      });

      const session = await responseOrder.json();
      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box width="80%" m="100px auto">
      <Stepper activeStep={activeStep} sx={{ m: "20px 0" }}>
        <Step>
          <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>
      <Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema[activeStep]}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              {isFirstStep && (
                <Shipping
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              {isSecondStep && (
                <Payment
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              <Box display="flex" justifyContent="space-between" gap="50px">
                {!isFirstStep && (
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    sx={{
                      backgroundColor: shades.primary[200],
                      boxShadow: "none",
                      color: "white",
                      borderRadius: 0,
                      padding: "15px 40px",
                    }}
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{
                    backgroundColor: shades.primary[400],
                    boxShadow: "none",
                    color: "white",
                    borderRadius: 0,
                    padding: "15px 40px",
                  }}
                >
                  {!isSecondStep ? "Next" : "Place Order"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const initialValues = {
  billingAddress: {
    firstName: "",
    lastName: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    pickup_location: "",
    Reservation_Start: new Date(),
    Reservation_End: new Date(),
    state: "",
    zipCode: "",
  },

  email: "",
  phoneNumber: "",
};
export const DatePickerStart = ({ setFieldValue }) => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    // Update form value when startDate changes
    setFieldValue("billingAddress.Reservation_Start", startDate);
  }, [startDate, setFieldValue]);

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      withPortal
    />
  );
};

export const DatePickerEnd = ({ setFieldValue }) => {
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    // Update form value when endDate changes
    setFieldValue("billingAddress.Reservation_End", endDate);
  }, [endDate, setFieldValue]);

  const minReservationStartDate = new Date();
  minReservationStartDate.setDate(minReservationStartDate.getDate() + 1);

  return (
    <DatePicker
      selected={endDate}
      onChange={(date) => setEndDate(date)}
      minDate={minReservationStartDate}
      withPortal
    />
  );
};
const checkoutSchema = [
  yup.object().shape({
    billingAddress: yup.object().shape({
      firstName: yup.string().required("required"),
      lastName: yup.string().required("required"),
      country: yup.string().required("required"),
      street1: yup.string().required("required"),
      street2: yup.string(),
      city: yup.string().required("required"),
      pickup_location: yup.string().required("required"),
      Reservation_Start: yup
        .date()
        .required("Reservation Start is required")
        .nullable(),
      Reservation_End: yup
        .date()
        .required("Reservation End is required")
        .min(
          yup.ref("Reservation_Start"),
          "Reservation End must be after Reservation Start"
        )
        .nullable(),
      state: yup.string().required("required"),
      zipCode: yup
        .string()
        .matches(/^\d+$/, "Zip Code must contain only numbers")
        .required("required"),
    }),
  }),
  yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: yup
      .string()
      .test("is-valid-phone", "Invalid phone number", function (value) {
        if (!value) {
          return true;
        }
        const phoneNumber = parsePhoneNumberFromString(value, "ZZ");
        return phoneNumber ? phoneNumber.isValid() : false;
      })
      .required("Phone Number is required"),
  }),
];

export default Checkout;
