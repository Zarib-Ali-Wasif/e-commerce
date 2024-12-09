import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Toolbar } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MailIcon from "@mui/icons-material/Mail";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FAQ from "../components/FAQ";

// Custom Theme with primary color #282c34
const theme = createTheme({
  palette: {
    primary: {
      main: "#1C4771", // New primary color
      light: "#4B5563", // A lighter shade for gradients or hover effects
      dark: "#1F2226", // A darker shade for text or borders
    },
    secondary: {
      main: "#BDBDBD", // A complementary secondary color
    },
    error: {
      main: "#D32F2F", // Red for error messages
    },
    info: {
      main: "#1976D2", // Blue for info icons
    },
    success: {
      main: "#388E3C", // Green for success messages
    },
    background: {
      default: "#F5F5F5", // Light background color
      paper: "#FFFFFF", // White background for cards
    },
    text: {
      primary: "#FFFFFF", // White for primary text on dark backgrounds
      secondary: "#332828", // Light gray for secondary text
    },
  },
  typography: {
    h3: {
      fontWeight: "bold",
      fontSize: "2rem", // You can customize the font size
    },
    body1: {
      fontSize: "1rem",
      opacity: 0.85,
    },
  },
});

const Contact = () => {
  const navigate = useNavigate();
  const handleEmail = (e) => {
    e.preventDefault();
    navigate("/email-us");
  };
  const handleWhatsapp = (e) => {
    e.preventDefault();
    const phoneNumber = "1234567890"; // Replace with the actual number
    const message =
      "Hello, I'm interested in learning more about your services!"; // Customize the message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <ThemeProvider theme={theme}>
      <Toolbar />
      <Box
        sx={{
          pt: 12,
          backgroundColor: "#d1dce8",
          minHeight: "60vh",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 6, maxWidth: 700 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="#387DA3"
            gutterBottom
          >
            Get in Touch with Us
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ opacity: 0.7, p: 1, textAlign: "justify" }}
          >
            Our team is here to provide the support and assistance you need.
            Feel free to reach out through any of the methods below, and we’ll
            get back to you promptly.
          </Typography>
        </Box>

        {/* Contact Cards */}
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: 1050,
            width: "100%",
            px: 3,
            justifyContent: "center",
          }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper, // White background for card
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for cards
                textAlign: "center",
                color: theme.palette.text.primary,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <SupportAgentIcon
                  sx={{
                    fontSize: 60,
                    // color: theme.palette.primary.main, // Primary color for icons
                    color: "#1C4771",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={theme.palette.primary.main}
                >
                  Customer Support
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: 11, mb: 2 }}>
                  24/7 Customer Support
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={2}>
                  Our friendly team is here to help you.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 20,
                    textTransform: "none",
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                  }}
                >
                  Chat Now
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                color: theme.palette.text.primary,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <MailIcon
                  sx={{
                    fontSize: 60,
                    color: theme.palette.primary.main, // Secondary color for icons
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={theme.palette.primary.main}
                >
                  Email Us
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: 11, mb: 2 }}>
                  shopeasy.mern@gmail.com
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={2}>
                  Quick response within 24 hours
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 20,
                    textTransform: "none",
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                  }}
                  onClick={handleEmail}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                color: theme.palette.text.primary,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <WhatsAppIcon
                  sx={{
                    fontSize: 60,
                    color: theme.palette.success.main, // Green for success icon
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={theme.palette.primary.main}
                >
                  Whatsapp
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: 11, mb: 2 }}>
                  123-456-7890
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={2}>
                  Monday - Friday, 9:00 AM - 6:00 PM
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{
                    borderRadius: 20,
                    textTransform: "none",
                    color: theme.palette.success.main,
                    borderColor: theme.palette.success.main,
                  }}
                  onClick={handleWhatsapp}
                >
                  {/* 123-456-7890 */}
                  Whatsapp Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {/* FAQ section */}
      <FAQ />
    </ThemeProvider>
  );
};

export default Contact;
