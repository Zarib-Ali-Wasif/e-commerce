import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const EmailUs = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { from_name, email, message } = formData;
    const updatedFormData = {
      to_name: "Shop Easy",
      from_name,
      reply_to: email,
      message,
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        updatedFormData,
        import.meta.env.VITE_EMAILJS_USER_ID
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          setFormData({ from_name: "", email: "", message: "" });
        },
        (error) => {
          toast.error("Failed to send message. Error: " + error.text);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 2,
        marginTop: 10,
        // backgroundColor: "#f4f4f4",
        borderRadius: 2,
        minHeight: "80vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{ marginBottom: 4, fontWeight: "bold", color: "#1C4771" }}
      >
        Send a Message
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="from_name"
          value={formData.from_name}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
          multiline
          rows={4}
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              backgroundColor: "#1C4771",
              width: "60%",
              "&:hover": {
                backgroundColor: "#1A3F61", // Slightly darker shade
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Shadow on hover
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "#1C4771" }} />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default EmailUs;
