import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { GST_PERCENT } from "./../lib/utils/helperFunctions";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const { productsList } = useSelector((state) => state.products);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("order"));
    setOrder(orderData);
  }, []);

  const handleContinueShopping = () => {
    navigate("/products");
    localStorage.removeItem("order");
  };

  if (!order)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
          minHeight: "70vh",
          mt: 15,
        }}
      >
        <Typography variant="h4" fontWeight={"bold"} color="textSecondary">
          Loading...
        </Typography>
      </Box>
    );

  const {
    orderNumber,
    orderDate,
    paymentMethod,
    status,
    address,
    email,
    orderItems,
    summary,
  } = order;

  return (
    <Box sx={{ mt: 18, textAlign: "center", mx: "auto", maxWidth: 900 }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: "#1C4771", mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" color="#1C4771">
        Thank You for Your Order!
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{ maxWidth: 600, mx: "auto", my: 2 }}
      >
        Your order has been successfully placed. We will notify you with updates
        soon.
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            Order Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                gap: 0.5,
                margin: "0 auto",
              }}
            >
              <Typography variant="body2" sx={{ overflowWrap: "none" }}>
                <strong>Order Number:</strong> {orderNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Order Date:</strong>{" "}
                {new Date(orderDate).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Order Status:</strong> {status || "Pending"}
              </Typography>
              <Typography variant="body2">
                <strong>Payment Method:</strong> {paymentMethod}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                gap: 0.5,
              }}
            >
              <Typography variant="body2">
                <strong>Email:</strong> {email}
              </Typography>
              <Typography variant="body2">
                <strong>Shipping Address:</strong> {address}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold">
            Ordered Items
          </Typography>
          <Grid container mt={3}>
            {orderItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "#f9f9f9",
                    textAlign: "left",
                  }}
                >
                  <Typography variant="body2">
                    <strong>Product:</strong>{" "}
                    <span style={{ color: "#757575" }}>
                      {productsList.find(
                        (product) => product._id === item.productId
                      )?.title || item.productId}
                    </span>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ mt: 3, fontWeight: "600" }}
          >
            Order Summary
          </Typography>
          <Typography variant="body2">
            <strong>Subtotal:</strong> ${summary.subtotal}
          </Typography>
          <Typography variant="body2">
            <strong>Discount:</strong> ${summary.discount}
          </Typography>
          <Typography variant="body2">
            <strong>GST (</strong>
            <span>{GST_PERCENT}%</span>
            <strong>):</strong> ${summary.gst}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
            <strong>Total:</strong> ${summary.total}
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        startIcon={<ShoppingCartIcon />}
        sx={{
          mt: 4,
          mb: 8,
          px: 5,
          py: 1.5,
          backgroundColor: "#1C4771",
          color: "white",
          "&:hover": {
            backgroundColor: "#163b56",
          },
        }}
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </Button>
      <ToastContainer />
    </Box>
  );
};

export default OrderConfirmation;
