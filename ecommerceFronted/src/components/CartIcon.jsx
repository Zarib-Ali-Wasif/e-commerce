// src/components/CartIcon.js
import React from "react";
import { useSelector } from "react-redux";
import { Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

const CartIcon = () => {
  const cart = useSelector((state) => state.cart);

  return (
    <Link to="/cart">
      <IconButton color="primary">
        <Badge badgeContent={cart.totalQuantity} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Link>
  );
};

export default CartIcon;
