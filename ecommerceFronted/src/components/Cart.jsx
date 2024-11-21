import React from "react";
import { useCart } from "../context/CartContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
} from "@mui/material";

const Cart = () => {
  const { cart, productsList, removeFromCart, clearCart } = useCart();

  const getProductDetails = (productId) =>
    productsList.find((product) => product.id === productId) || {};

  const calculateSubtotal = () =>
    cart.reduce((total, item) => {
      const product = getProductDetails(item.id);
      return total + (product.price || 0) * item.quantity;
    }, 0);

  const subtotal = calculateSubtotal();
  const discount = 0; // Default discount (0%)
  const gst = 16; // GST percentage
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const calculateTotal = () => {
    const discountAmount = (subtotal * discount) / 100;
    const gstAmount = (subtotal * gst) / 100;
    return subtotal - discountAmount + gstAmount;
  };

  return (
    <Box sx={{ padding: "20px", minHeight: "100vh", mt: 12 }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        My Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          Your cart is empty.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {cart.map((cartItem) => {
                const product = getProductDetails(cartItem.id);
                return (
                  <Grid item xs={12} sm={6} key={cartItem.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{product.title}</Typography>
                        <Typography>
                          Quantity: {cartItem.quantity} x ${product.price || 0}{" "}
                          = ${cartItem.quantity * (product.price || 0)}
                        </Typography>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => removeFromCart(cartItem.id)}
                          sx={{ mt: 1 }}
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ padding: "20px" }}>
              <Typography variant="h6">Order Summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography>Total Items: {totalItems}</Typography>
              <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
              <Typography>Discount: {discount}%</Typography>
              <Typography>
                GST (16%): ${((subtotal * gst) / 100).toFixed(2)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Checkout
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={clearCart}
                sx={{ mt: 2 }}
              >
                Clear Cart
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
