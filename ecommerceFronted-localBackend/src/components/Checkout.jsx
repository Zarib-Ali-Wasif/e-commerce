import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "./../lib/redux/slices/cartSlice"; // Import your clearCart action
import { useNavigate } from "react-router-dom";
import api from "./../lib/services/api";
import { getProductDetails } from "./../lib/utils/helperFunctions";
import { fetchProducts } from "./../lib/redux/slices/productsSlice";
import { toast } from "react-toastify";
import { GST_PERCENT } from "./../lib/utils/helperFunctions";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, cartSummary } = useSelector((state) => state.cart);
  const { productsList } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts("all"));
  }, [dispatch]);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve user details from localStorage or Redux (modify as needed)
  const { user } = JSON.parse(localStorage.getItem("user")) ||
    useSelector((state) => state.auth) || {
      userId: "guest",
      name: "Guest User",
      email: "guest@example.com",
    };

  // Generate a unique order number
  const generateOrderNumber = () => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    return `ORD-${user.userId.slice(-4)}-${timestamp.slice(
      -11
    )}-${randomSuffix}`;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add items before placing an order.");
      return;
    }

    if (!address || !paymentMethod) {
      alert("Please complete all fields before proceeding.");
      return;
    }

    const orderNumber = generateOrderNumber();

    const orderDetails = {
      orderNumber,
      userId: user.userId,
      userName: user.name,
      email: user.email,
      address,
      paymentMethod,
      orderItems: cart.map((item) => {
        const cartProduct = getProductDetails(item.cartItemId, productsList);
        return {
          productId: item.cartItemId,
          productName: cartProduct.title,
          productCategory: cartProduct.category,
          quantity: item.quantity,
          price: cartProduct.price,
          total: item.quantity * cartProduct.price,
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
      setLoading(true); // Show loader
      const response = await api.post(`orders`, orderDetails);
      localStorage.setItem("order", JSON.stringify(orderDetails));
      dispatch(clearCart()); // Clear cart via Redux
      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { state: { orderNumber } });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false); // Hide loader
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
                const cartproduct = getProductDetails(
                  cartItem.cartItemId,
                  productsList
                );
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
                      src={cartproduct.image}
                      alt={cartproduct.title}
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
                          {cartproduct.title}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          fontSize={12}
                          textAlign="justify"
                          fontWeight="bold"
                          fontFamily="Rubik"
                        >
                          {cartproduct.category}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        ${cartproduct.price} x {cartItem.quantity}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                Subtotal: ${cartSummary.subtotal}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                Discount: ${cartSummary.discount}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                GST ({GST_PERCENT}%): ${cartSummary.gst}
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
                select
                fullWidth
                variant="outlined"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ mb: 3 }}
              >
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
              </TextField>
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
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
