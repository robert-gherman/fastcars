import { getIn } from "formik";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { DatePickerStart, DatePickerEnd } from "../Checkout/Checkout.js";
const AddressForm = ({
  type,
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  setFieldValue,
}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const formattedName = (field) => `${type}.${field}`;

  const formattedError = (field) =>
    Boolean(
      getIn(touched, formattedName(field)) &&
        getIn(errors, formattedName(field))
    );

  const formattedHelper = (field) =>
    getIn(touched, formattedName(field)) && getIn(errors, formattedName(field));

  return (
    <Box
      display="grid"
      gap="15px"
      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      sx={{
        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
      }}
    >
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            First Name
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.firstName}
        name={formattedName("firstName")}
        error={formattedError("firstName")}
        helperText={formattedHelper("firstName")}
        sx={{ gridColumn: "span 2" }}
      />
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            Last Name
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.lastName}
        name={formattedName("lastName")}
        error={formattedError("lastName")}
        helperText={formattedHelper("lastName")}
        sx={{ gridColumn: "span 2" }}
      />

      <div
        className="datepicker-container"
        style={{ gridColumn: "span 2", width: "100%" }}
      >
        <label style={{ color: "grey" }}>
          Reservation Date Start:
          <span style={{ color: "red" }}>*</span>
        </label>
        <DatePickerStart setFieldValue={setFieldValue} />
      </div>
      <div
        className="datepicker-container"
        style={{ gridColumn: "span 2", width: "300px" }}
      >
        <label style={{ color: "grey" }}>
          Reservation Date End:
          <span style={{ color: "red" }}>*</span>
        </label>

        <DatePickerEnd setFieldValue={setFieldValue} />
      </div>
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            Country
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.country}
        name={formattedName("country")}
        error={formattedError("country")}
        helperText={formattedHelper("country")}
        sx={{ gridColumn: "span 4" }}
      />
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            Street Address
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.street1}
        name={formattedName("street1")}
        error={formattedError("street1")}
        helperText={formattedHelper("street1")}
        sx={{ gridColumn: "span 2" }}
      />
      <TextField
        fullWidth
        type="text"
        label="Street Address 2 (optional)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.street2}
        name={formattedName("street2")}
        error={formattedError("street2")}
        helperText={formattedHelper("street2")}
        sx={{ gridColumn: "1fr" }}
      />
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            Pickup Location
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.pickup_location}
        name={formattedName("pickup_location")}
        error={formattedError("pickup_location")}
        helperText={formattedHelper("pickup_location")}
        sx={{ gridColumn: "1fr" }}
      />
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            City
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.city}
        name={formattedName("city")}
        error={formattedError("city")}
        helperText={formattedHelper("city")}
        sx={{ gridColumn: "span 2" }}
      />
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            State
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.state}
        name={formattedName("state")}
        error={formattedError("state")}
        helperText={formattedHelper("state")}
        sx={{ gridColumn: "1fr" }}
      />
      <TextField
        fullWidth
        type="text"
        label={
          <span>
            Zip code
            <span style={{ color: "red" }}>*</span>
          </span>
        }
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.zipCode}
        name={formattedName("zipCode")}
        error={formattedError("zipCode")}
        helperText={formattedHelper("zipCode")}
        sx={{ gridColumn: "1fr" }}
      />
    </Box>
  );
};

export default AddressForm;
