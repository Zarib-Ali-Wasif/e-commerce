import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for making API calls

const Checkout = () => {
  const { cart, clearCart, cartSummary, productsList } = useCart(); // Using cartSummary from CartContext
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  // Assuming user is fetched from context or some auth service
  const user = { id: "12345", name: "John Doe", email: "john@example.com" };

  const getProductDetails = (productId) =>
    productsList.find((product) => product.id === productId) || {};

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      alert("Please complete all fields before proceeding.");
      return;
    }

    const orderDetails = {
      userId: user.id,
      userName: user.name,
      email: user.email,
      address,
      paymentMethod,
      orderItems: cart.map((item) => {
        const product = getProductDetails(item.id);
        return {
          productId: item.id,
          productName: product.title,
          productCategory: product.category,
          quantity: item.quantity,
          price: product.price,
          total: item.quantity * product.price,
        };
      }),
      summary: {
        subtotal: cartSummary.subtotal,
        discount: cartSummary.discount,
        gst: cartSummary.gst,
        total: cartSummary.total,
      },
      orderDate: new Date().toISOString(),
    };

    try {
      // API call to save order in the backend
      const response = await axios.post("/api/orders", orderDetails);
      console.log("Order saved successfully:", response.data);

      // Clear the cart and navigate to the Order Confirmation page
      clearCart();
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: "20px", minHeight: "100vh", mt: 15 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        Checkout
      </Typography>
      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign={"center"}
                gutterBottom
              >
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              {cart.map((cartItem, index) => {
                const product = getProductDetails(cartItem.id);
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <Box
                      sx={{
                        ml: 4,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "70%",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          textAlign="justify"
                        >
                          {product.title}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          fontSize={12}
                          textAlign="justify"
                          fontWeight="bold"
                          fontFamily="Rubik"
                        >
                          {product.category}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        ${product.price} x {cartItem.quantity}
                      </Typography>
                    </Box>{" "}
                  </Box>
                );
              })}
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                Subtotal: ${cartSummary.subtotal.toFixed(2)}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                Discount: ${cartSummary.discount.toFixed(2)}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                GST: ${cartSummary.gst.toFixed(2)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight="bold" textAlign="right">
                Total: ${isNaN(cartSummary.total) ? "0.00" : cartSummary.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Address and Payment Section */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign={"center"}
                gutterBottom
              >
                Shipping & Payment
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" mb={1}>
                Address:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your shipping address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Typography variant="body1" mb={1}>
                Payment Method:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="e.g., Credit Card, PayPal"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#1C4771",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#163b56",
                  },
                }}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
