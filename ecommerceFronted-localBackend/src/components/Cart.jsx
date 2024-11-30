import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { ToastContainer, toast } from "react-toastify";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
  updateCartSummary,
} from "../../lib/redux/slices/cartSlice";
import { fetchProducts } from "../../lib/redux/slices/productsSlice";
import { getProductDetails } from "../../lib/utils/helperFunctions";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, cartSummary } = useSelector((state) => state.cart);
  console.log("cartSummary", cartSummary);
  console.log("cart", cart);
  const { productsList, categories } = useSelector((state) => state.products);

  // Optional: log or handle side effects if needed
  useEffect(() => {
    console.log("Cart or cart summary updated:", cart, cartSummary);
  }, [cart, cartSummary]); // Run whenever cart or cartSummary changes

  useEffect(() => {
    dispatch(fetchProducts("all"));
  }, [dispatch]);

  const handleAddMoreItems = () => {
    navigate("/products");
  };

  const handleUpdateQuantity = (productId, quantity) => {
    console.log("productId", productId);
    console.log("quantity", quantity);
    if (quantity < 1) return; // Prevent quantity from going below 1
    console.log("quantityafter", quantity);
    dispatch(updateQuantity({ productId, quantity })); // Call updateQuantity function from context
    dispatch(updateCartSummary(productsList));
  };

  const handleCheckout = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    console.log(isAuthenticated);
    if (isAuthenticated || isAuthenticated === "true") {
      navigate("/checkout");
    } else {
      toast.error("Please login to checkout.");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    }
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
                const cartProduct = getProductDetails(
                  cartItem.cartItemId,
                  productsList
                );
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    xl={2}
                    key={cartItem.cartItemId}
                  >
                    <Card sx={{ display: "flex", height: "100%" }}>
                      <Grid container>
                        {/* Image Section */}
                        <Grid item xs={12}>
                          <img
                            src={cartProduct.image}
                            alt={cartProduct.title}
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
                              {cartProduct.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {cartProduct.category}
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
                              $
                              {(cartProduct.price * cartItem.quantity).toFixed(
                                2
                              ) || 0}
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
                                      cartItem.cartItemId,
                                      cartItem.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={() => {
                                    dispatch(
                                      removeFromCart(cartItem.cartItemId)
                                    );
                                    dispatch(updateCartSummary(productsList));
                                  }}
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
                                    cartItem.cartItemId,
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
                margin: "60px auto",
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
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => dispatch(clearCart())}
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
          <ToastContainer />
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
