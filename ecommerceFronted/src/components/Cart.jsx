import React from "react";
import { useCart } from "../context/CartContext";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Cart = ({ products }) => {
  const { cart, removeFromCart } = useCart();

  // const product = products.find((p) => p.id === productId);

  const getProductDetails = (productId) =>
    products.find((product) => product.id === productId);

  return (
    <Box sx={{ padding: "20px", minHeight: "100vh", mt: 18 }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        My Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          Your cart is empty.
        </Typography>
      ) : (
        <List>
          {cart.map((cartItem) => {
            const product = getProductDetails(cartItem.productId);
            return (
              <ListItem
                key={cartItem.productId}
                sx={{ borderBottom: "1px solid #ddd" }}
              >
                <ListItemText
                  primary={product.title}
                  secondary={`Quantity: ${cartItem.quantity} | Price: $${product.price}`}
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeFromCart(cartItem.productId)}
                >
                  Remove
                </Button>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default Cart;
