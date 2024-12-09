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
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false); // State to toggle details visibility

  const handleFetchOrder = async () => {
    try {
      setError(""); // Clear any previous errors
      const response = await api.get(`orders/${orderNumber}`);
      setOrderData(response.data);
      setShowDetails(false); // Reset details visibility when fetching new order
    } catch (err) {
      setError("Order not found. Please check the order number.");
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
              helperText={error && orderNumber === "" ? "Required" : ""}
            />
            <Button
              variant="contained"
              sx={{ width: "30%", maxHeight: 55, backgroundColor: "#1c4771" }}
              onClick={() => {
                if (orderNumber === "") {
                  setError(true);
                } else {
                  setError(false);
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
            color={statusColorMap[orderData.status] || "default"} // Default if status doesn't match
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

          {showDetails && (
            <>
              <Box
                sx={{
                  mt: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ p: 2, borderRadius: 1 }}>
                  <Divider
                    sx={{
                      width: "800px",
                      maxWidth: { xs: "30%", sm: "60%", md: "80%", lg: "50%" },
                      margin: "0 auto",
                      borderWidth: 1,
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
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default TrackOrder;
