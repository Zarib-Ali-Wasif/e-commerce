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

const Checkout = () => {
  const { cart, clearCart, cartSummary, productsList } = useCart(); // Using cartSummary from CartContext
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!address || !paymentMethod) {
      alert("Please complete all fields before proceeding.");
      return;
    }

    // Clear the cart and navigate to the Order Confirmation page
    clearCart();
    navigate("/order-confirmation");
  };

  const getProductDetails = (productId) =>
    productsList.find((product) => product.id === productId) || {};

  return (
    <Box sx={{ padding: "20px", minHeight: "100vh", mt: 15 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        Checkout
      </Typography>
      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
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
                    }}
                  >
                    {/* Displaying the product name (e.g., item.title) and price */}
                    <Typography>{product.title}</Typography>{" "}
                    {/* Ensure this matches your cart item structure */}
                    <Typography>
                      ${product.price} x {cartItem.quantity}
                    </Typography>
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Shipping & Payment
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Address Input */}
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

              {/* Payment Method */}
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

              {/* Place Order Button */}
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
