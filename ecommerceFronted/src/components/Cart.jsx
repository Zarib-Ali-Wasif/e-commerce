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
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = () => {
  const { cart, productsList, removeFromCart, clearCart, updateQuantity } =
    useCart();
  const navigate = useNavigate();

  const getProductDetails = (productId) =>
    productsList.find((product) => product.id === productId) || {};

  const calculateSubtotal = () =>
    cart.reduce((total, item) => {
      const product = getProductDetails(item.id);
      return total + (product.price || 0) * item.quantity;
    }, 0);

  const subtotal = calculateSubtotal();
  const discount = 0;
  const gst = 16;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const calculateTotal = () => {
    const discountAmount = (subtotal * discount) / 100;
    const gstAmount = (subtotal * gst) / 100;
    return subtotal - discountAmount + gstAmount;
  };

  const handleAddMoreItems = () => {
    navigate("/products");
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return; // Prevent quantity from going below 1
    updateQuantity(productId, quantity); // Call updateQuantity function from context
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
                    <Card
                      sx={{
                        height: "350px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent>
                        <Grid item xs={12} key={cartItem.id}>
                          <Grid>
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{
                                width: "100%",
                                height: "100px",
                                objectFit: "contain",
                                borderRadius: "8px",
                                marginBottom: "10px",
                                cursor: "pointer",
                              }}
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="h6">
                              {product.title}
                            </Typography>
                            <Typography>
                              {/* ${product.price || 0} x {cartItem.quantity} = $ */}
                              {(product.price || 0) * cartItem.quantity}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "5px",
                                width: "fit-content",
                                marginTop: "10px",
                              }}
                            >
                              {cartItem.quantity > 1 ? (
                                <>
                                  <IconButton
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        cartItem.id,
                                        cartItem.quantity - 1
                                      )
                                    }
                                  >
                                    -
                                  </IconButton>
                                  <Typography>{cartItem.quantity}</Typography>
                                  <IconButton
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        cartItem.id,
                                        cartItem.quantity + 1
                                      )
                                    }
                                  >
                                    +
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  onClick={() => removeFromCart(cartItem.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddMoreItems}
              sx={{
                width: "200px",
                margin: "20px auto",
                display: "block",
                backgroundColor: "#1C4771",
                color: "white",
                borderColor: "#1C4771",
                "&:hover": {
                  backgroundColor: "#163b56",
                  borderColor: "#163b56",
                },
              }}
            >
              Add More Items
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ padding: "20px", backgroundColor: "#fff" }}>
              <Typography variant="h6" textAlign="center" color="black">
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography color="black">Total Items: {totalItems}</Typography>
              <Typography color="black">
                Subtotal: ${subtotal.toFixed(2)}
              </Typography>
              <Typography color="black">Discount: {discount}%</Typography>
              <Typography color="black">
                GST (16%): ${((subtotal * gst) / 100).toFixed(2)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="black" textAlign="center">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#1C4771",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#163b56",
                  },
                }}
              >
                Checkout
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={clearCart}
                sx={{
                  mt: 2,
                  borderColor: "#1C4771",
                  color: "black",
                  "&:hover": {
                    borderColor: "#163b56",
                    color: "#163b56",
                  },
                }}
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
