// src/components/AddToCartButton.js
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { addToCart } from "../redux/cartSlice";

const AddToCartButton = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <Button variant="contained" color="primary" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
