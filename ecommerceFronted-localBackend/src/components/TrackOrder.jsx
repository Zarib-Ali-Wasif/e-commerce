import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import api from "../lib/services/api";

function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleFetchOrder = async () => {
    try {
      setError(false);
      setErrorMessage("");
      const response = await api.get(`orders/${orderNumber}`);
      setOrderData(response.data);
      setShowDetails(false);
    } catch (err) {
      setError(true);
      setErrorMessage("Order not found. Please check the order number.");
      setOrderData(null);
    }
  };

  const statusColorMap = {
    Pending: "warning",
    Processing: "secondary",
    Shipped: "primary",
    Delivered: "success",
    Canceled: "error",
  };

  return (
    <Box sx={{ px: 2, py: 22, mb: 60 }}>
      <Box
        sx={{
          maxWidth: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
          width: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            mb={6}
            sx={{ fontWeight: "bold", color: "#1c4771" }}
          >
            Track Your Order
          </Typography>

          <Box
            sx={{
              mb: 4,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TextField
              label="Order Number"
              variant="outlined"
              sx={{ width: "100%" }}
              value={orderNumber}
              required
              onChange={(e) => setOrderNumber(e.target.value)}
              error={error && orderNumber === ""}
              helperText={
                error && orderNumber === "" ? "Required" : errorMessage
              }
            />
            <Button
              variant="contained"
              sx={{ width: "30%", maxHeight: 55, backgroundColor: "#1c4771" }}
              onClick={() => {
                if (orderNumber === "") {
                  setError(true);
                  setErrorMessage("Order number is required.");
                } else {
                  setError(false);
                  setErrorMessage("");
                  handleFetchOrder();
                }
              }}
            >
              Track
            </Button>
          </Box>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {orderData && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#1c4771",
              mb: 4,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Order Overview
          </Typography>
          <Typography>
            <strong>Order Number:</strong> {orderData.orderNumber}
          </Typography>
          <Chip
            sx={{ my: 1 }}
            label={orderData.status}
            color={statusColorMap[orderData.status] || "default"}
            size="small"
          />
          <Typography>
            <strong>Order Date:</strong>{" "}
            {new Date(orderData.orderDate).toLocaleString()}
          </Typography>
          <Typography>
            <strong>Address:</strong> {orderData.address}
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 4, color: "#1c4771", borderColor: "#1c4771" }}
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>

          {/* Prevent layout shift when toggling details */}
          <Box sx={{ display: showDetails ? "block" : "none" }}>
            <Box
              sx={{
                mt: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Divider
                  sx={{
                    width: "100%", // Ensure full width inside the container
                    maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "60%" }, // Responsive max width
                    margin: "16px auto", // Add spacing and center align
                    borderWidth: "1px", // Ensure the thickness of the divider is set
                    borderStyle: "solid", // Explicitly set border style
                    borderColor: "rgba(0, 0, 0, 0.12)", // Default MUI divider color
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                Order Summary
              </Typography>
              <Typography>
                <strong>Subtotal:</strong> ${orderData.summary.subtotal}
              </Typography>
              <Typography>
                <strong>Discount:</strong> ${orderData.summary.discount}
              </Typography>
              <Typography>
                <strong>GST:</strong> ${orderData.summary.gst}
              </Typography>
              <Typography>
                <strong>Total:</strong> ${orderData.summary.total}
              </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight={"bold"}>
                Order Items
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {orderData.orderItems.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <img
                        src={item.image}
                        alt={item.productName.slice(0, 20)}
                        width={30}
                        height={30}
                      />
                      <Typography>
                        <strong>Product:</strong> {item.productName}
                      </Typography>
                      <Typography>
                        <strong>Category:</strong> {item.productCategory}
                      </Typography>
                      <Typography>
                        <strong>Quantity:</strong> {item.quantity}
                      </Typography>
                      <Typography>
                        <strong>Price:</strong> ${item.price}
                      </Typography>
                      <Typography>
                        <strong>Subtotal:</strong> ${item.total}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default TrackOrder;
