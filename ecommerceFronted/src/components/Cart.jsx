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
  const {
    cart,
    cartSummary,
    productsList,
    removeFromCart,
    clearCart,
    updateQuantity,
  } = useCart();
  const navigate = useNavigate();

  const getProductDetails = (productId) =>
    productsList.find((product) => product.id === productId) || {};

  const handleAddMoreItems = () => {
    navigate("/products");
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return; // Prevent quantity from going below 1
    updateQuantity(productId, quantity); // Call updateQuantity function from context
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Box sx={{ padding: "20px", minHeight: "100vh", mt: 15 }}>
      <Typography variant="h4" textAlign="center" fontWeight={"bold"} mb={4}>
        My Cart
      </Typography>
      {cart.length === 0 ? (
        <Box textAlign="center">
          <Typography variant="h5" mb={2}>
            Your cart is empty.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMoreItems}
            sx={{
              backgroundColor: "#1C4771",
              color: "white",
              "&:hover": {
                backgroundColor: "#163b56",
              },
            }}
          >
            Go to Shop Now
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {cart.map((cartItem) => {
                const product = getProductDetails(cartItem.id);
                return (
                  <Grid item xs={12} sm={6} lg={4} xl={2} key={cartItem.id}>
                    <Card sx={{ display: "flex", height: "100%" }}>
                      <Grid container>
                        {/* Image Section */}
                        <Grid item xs={12}>
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "contain",
                              borderRadius: "8px 8px 0 0",
                            }}
                          />
                        </Grid>

                        {/* Typography Section */}
                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1, padding: "10px" }}>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {product.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {product.category}
                            </Typography>
                          </CardContent>

                          {/* Price and Quantity Section */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px",
                              borderTop: "1px solid #ccc",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="primary"
                            >
                              ${product.price * cartItem.quantity || 0}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                border: "1px solid #ccc",
                                padding: "0px 5px",
                                borderRadius: "25px",
                              }}
                            >
                              {cartItem.quantity > 1 ? (
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
                              ) : (
                                <IconButton
                                  onClick={() => removeFromCart(cartItem.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                              <Typography sx={{ marginX: "10px" }}>
                                {cartItem.quantity}
                              </Typography>
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
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
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
                width: { xs: "95%", md: "50%" },
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

          {/* Order Summary Section */}
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: "20px", backgroundColor: "#fff" }}>
              <Box
                sx={{
                  padding: 3,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h5"
                  textAlign="center"
                  fontWeight="bold"
                  color="#1C4771"
                  gutterBottom
                >
                  Cart Summary
                </Typography>
                <Divider sx={{ my: 2, borderColor: "#1C4771" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary" fontWeight="bold">
                    Total Items:
                  </Typography>
                  <Typography color="black">
                    {cartSummary.totalItems}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary" fontWeight="bold">
                    Subtotal:
                  </Typography>
                  <Typography color="black">
                    ${cartSummary.subtotal.toFixed(2) || 0}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary" fontWeight="bold">
                    Discount:
                  </Typography>
                  <Typography color="black">
                    {cartSummary.discount || 0}%
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary" fontWeight="bold">
                    GST (16%):
                  </Typography>
                  <Typography color="black">${cartSummary.gst || 0}</Typography>
                </Box>

                <Divider sx={{ my: 2, borderColor: "#1C4771" }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    Total:
                  </Typography>
                  <Typography variant="h6" color="#1C4771" fontWeight="bold">
                    ${cartSummary.total || 0}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleCheckout}
                sx={{
                  display: "block",
                  margin: "20px auto 0 auto",
                  width: { xs: "100%", md: "80%" },
                  backgroundColor: "#1C4771",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#163b56",
                  },
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                sx={{
                  display: "block",
                  margin: "15px auto 0 auto",
                  width: { xs: "100%", md: "80%" },
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
