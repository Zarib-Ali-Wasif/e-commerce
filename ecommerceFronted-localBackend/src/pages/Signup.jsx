import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import api from "../../lib/services/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState();
  const [file, setFile] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const imageUrl = URL.createObjectURL(uploadedFile);
    setUserProfilePicture(imageUrl);
  };

  const clickhandle = () => {
    navigate("/login");
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    contactNumber: Yup.string()
      .matches(
        /^\+?\d{1,4}[-\s.]?\(?\d{1,4}\)?[-\s.]?\d{1,4}[-\s.]?\d{1,9}$/,
        "Contact number must be 10 to 15 digits long and may start with a '+'"
      )
      .required("Contact number is required"),
    gender: Yup.string().required("Gender is required"),
    age: Yup.number().required("Age is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]+$/,
        "Password must contain one uppercase, one lowercase, one digit, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"), // Validation to check if passwords match
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      gender: "",
      age: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        // const formData = new FormData();
        // if (file) {
        //   formData.append("image", file);
        // }

        // const imageResponse = file
        //   ? await api.post("image/upload/single", formData, {
        //       headers: { "Content-Type": "multipart/form-data" },
        //     })
        //   : { data: "" };
        // console.log("Image Upload Response:", imageResponse.data);
        // const imageUrl = imageResponse.data;
        // Prepare user data, excluding 'confirmPassword' field
        const { confirmPassword, ...userData } = data; // Exclude confirmPassword

        // const userDataWithImage = {
        //   ...userData,
        //   profilePic: imageUrl || "", // Attach the uploaded image URL if available
        // };

        // Send the request to create the user
        const response = await api.post("user/signUp", userData);

        if (typeof window !== "undefined") {
          // Save user email in localStorage
          localStorage.setItem("email", data.email);

          // Notify user about OTP sent to email
          toast.success(
            "Sign up successful. OTP has been sent to your email for verification.",
            {
              autoClose: 1500, // Close after 1.5 seconds
            }
          );

          // Reset the form after submission
          resetForm();

          // Pass `redirectTo` as 'login' to indicate the flow context
          setTimeout(() => {
            navigate("/otp-verification", {
              state: { redirectTo: "login" },
            });
          }, 2000);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
        toast.error("Error: Failed to sign up. Please try again later.");
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        maxWidth: "400px",
        margin: "auto",
        padding: "100px 20px", // Add some padding to the container for better spacing
      }}
    >
      {/* Sign-up Heading */}
      <Typography
        sx={{
          fontSize: { xs: "42px", sm: "64px" },
          fontWeight: 500,
          mb: 2,
          mt: 12,
          color: "#1C4771", //  replace with your desired color code
        }}
      >
        Sign Up
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Already a member?{" "}
        <span
          onClick={clickhandle}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Log In
        </span>{" "}
      </Typography>

      {/* Profile Picture Section */}
      {/* <Box sx={{ mt: 2 }}>
        <label htmlFor="avatarInput">
          <Avatar
            alt="User Profile"
            src={userProfilePicture}
            sx={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              margin: "auto",
            }}
          />
        </label>
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </Box> */}

      {/* Form Fields */}
      <Box
        sx={{
          maxWidth: "380px",
          width: "100%",
          mt: 3,
        }}
      >
        <Typography sx={{ textAlign: "start" }}>Name</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="name"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.email && formik.errors.name ? (
            <Typography color="error">{formik.errors.name}</Typography>
          ) : null}
        </Box>

        <Typography sx={{ textAlign: "start" }}>Email</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="email"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <Typography color="error">{formik.errors.email}</Typography>
          ) : null}
        </Box>

        <Typography sx={{ textAlign: "start" }}>Contact Number</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="contactNumber"
            variant="standard"
            fullWidth
            type="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contactNumber}
          />
          {formik.touched.email && formik.errors.contactNumber ? (
            <Typography color="error">{formik.errors.contactNumber}</Typography>
          ) : null}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            mb: 1,
            mt: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "45%" }}>
            <TextField
              name="age"
              variant="standard"
              fullWidth
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.age}
              placeholder="Age"
              sx={{
                height: "45px", // Ensure equal height
                "& .MuiInputBase-root": {
                  height: "45px", // Make sure the input field is the same height as Select
                },
              }}
            />
            {formik.touched.age && formik.errors.age ? (
              <Typography color="error">{formik.errors.age}</Typography>
            ) : null}
          </Box>

          <Box sx={{ width: "45%" }}>
            <FormControl fullWidth variant="standard">
              <Select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                displayEmpty
                fullWidth
                sx={{
                  height: "45px", // Set height for the select component
                  textAlign: "start",
                  "& .MuiSelect-select": {
                    paddingTop: "10px", // Adjust padding if needed to center the text vertically
                  },
                }}
              >
                <MenuItem value="" disabled sx={{ display: "none" }}>
                  <Typography color="textSecondary">Gender</Typography>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {formik.touched.gender && formik.errors.gender ? (
              <Typography color="error">{formik.errors.gender}</Typography>
            ) : null}
          </Box>
        </Box>

        {/* Password Section */}
        <Typography sx={{ textAlign: "start" }}>Password</Typography>

        <Box sx={{ mb: 1, position: "relative" }}>
          <TextField
            name="password"
            variant="standard"
            fullWidth
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <Box
            sx={{
              position: "absolute",
              right: "5px",
              top: "35%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "gray",
            }}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <VisibilityOff sx={{ color: "gray" }} />
            ) : (
              <Visibility sx={{ color: "gray" }} />
            )}
          </Box>
          {formik.touched.password && formik.errors.password ? (
            <Typography color="error">{formik.errors.password}</Typography>
          ) : null}
        </Box>

        <Typography sx={{ textAlign: "start" }}>Confirm Password</Typography>

        <Box sx={{ mb: 2, position: "relative" }}>
          <TextField
            name="confirmPassword"
            variant="standard"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          <Box
            sx={{
              position: "absolute",
              right: "5px",
              top: "35%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "gray",
            }}
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <VisibilityOff sx={{ color: "gray" }} />
            ) : (
              <Visibility sx={{ color: "gray" }} />
            )}
          </Box>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <Typography color="error">
              {formik.errors.confirmPassword}
            </Typography>
          ) : null}
        </Box>
        {/* Sign-up Button */}
        <Box>
          <Button
            onClick={formik.handleSubmit}
            sx={{
              maxWidth: "303px",
              width: "100%",
              border: "1px solid #1C4771", // Change to the desired color
              borderRadius: "4px",
              color: "#1C4771", // Button text color
              mt: 2,
              fontSize: "18px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#1C4771", // Hover background color
                color: "white", // Hover text color
              },
              "&:active": {
                backgroundColor: "#1C4771", // Active background color
                color: "white", // Active text color
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
        <ToastContainer />
      </Box>
    </Box>
  );
};

export default Signup;
