import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const { productsList } = useSelector((state) => state.products);

  useEffect(() => {
    // Retrieve order details from localStorage
    const orderData = JSON.parse(localStorage.getItem("order"));
    setOrder(orderData);
  }, []);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (!order)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          padding: "50px",
          minHeight: "70vh",
          mt: 15,
        }}
      >
        <Typography variant="h4" fontWeight={"bold"} color="textSecondary">
          You have not placed any orders yet.
        </Typography>
        ;
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
  console.log(productsList);

  return (
    <Box sx={{ mt: 20, textAlign: "center", mx: "auto", maxWidth: 800 }}>
      <Typography variant="h4" fontWeight="bold" color="#1C4771" gutterBottom>
        Thank You for Your Order!
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        maxWidth={350}
        margin={"auto"}
        mb={4}
      >
        Your order has been successfully placed. We will notify you with updates
        soon.
      </Typography>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            Order Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            <strong>Order Number:</strong> {order.orderNumber}
          </Typography>
          <Typography variant="body2">
            <strong>Order Date:</strong>{" "}
            {new Date(order.orderDate).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {order.status || "Pending"}
          </Typography>
          <Typography variant="body2">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {order.email}
          </Typography>
          <Typography variant="body2">
            <strong>Shipping Address:</strong> {order.address}
          </Typography>
          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Ordered Items
          </Typography>
          {order.orderItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                // display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                textAlign: "justify",
              }}
            >
              <Typography variant="body2">
                <strong>Product:</strong>{" "}
                {productsList.find((product) => product._id === item.productId)
                  ?.title || item.productId}
              </Typography>
              <Typography variant="body2">
                <strong>Quantity:</strong> {item.quantity}
              </Typography>
              {/* <Typography variant="body2">
                <strong>Price:</strong> ${item.price}
              </Typography> */}
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}

          <Typography variant="h6" sx={{ mt: 3 }}>
            Order Summary
          </Typography>
          <Typography variant="body2">
            <strong>Subtotal:</strong> ${order.summary.subtotal}
          </Typography>
          <Typography variant="body2">
            <strong>Discount:</strong> ${order.summary.discount}
          </Typography>
          <Typography variant="body2">
            <strong>GST:</strong> {order.summary.gst}%
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            <strong>Total:</strong> ${order.summary.total}
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#1C4771",
          mt: 4,
          mb: 8,
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
