// src/pages/CartPage.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Grid, Typography } from "@mui/material";
import { removeFromCart, clearCart } from "../redux/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart.items.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <Grid container spacing={2}>
          {cart.items.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <div>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">Price: ${item.price}</Typography>
                <Typography variant="body2">
                  Quantity: {item.quantity}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
      <div>
        <Typography variant="h6">Total: ${cart.totalPrice}</Typography>
        <Button variant="contained" color="secondary" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
