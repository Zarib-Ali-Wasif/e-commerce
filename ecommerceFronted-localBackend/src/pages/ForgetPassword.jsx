import React from "react";
import { Typography, Box, TextField, Checkbox, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

const ForgetPassword = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email().required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (data, { resetForm }) => {
      axios
        .post("https://jsonplaceholder.typicode.com/posts", data)
        .then((response) => {
          console.log(response.data);
          toast.success(
            "Password reset link sent to your email. Please check your email to reset your password."
          );
          router.push("/login");
          resetForm();
        })
        .catch((error) => {
          console.error("An error occurred:", error.message);
        });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: "54px", fontWeight: 500, mb: 2 }}>
        Reset password
      </Typography>
      <Typography sx={{ width: "280px" }}>
        Enter your login email and we’ll send you a link to reset your password
      </Typography>
      <Box sx={{ mt: 4, width: "300px" }}>
        <Typography sx={{ textAlign: "start" }}>Email</Typography>
        <Box sx={{ mb: 2 }}>
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
      </Box>
      <Box>
        <Button
          onClick={formik.handleSubmit}
          sx={{
            width: "303px",
            borderRadius: "10px",
            backgroundColor: "black",
            color: "white",
            mt: 2,
            height: "54px",
            fontSize: "18px",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "black",
            },
            "&:active": {
              backgroundColor: "black",
            },
          }}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
};

export default ForgetPassword;
