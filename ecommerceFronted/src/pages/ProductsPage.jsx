// src/pages/ProductsPage.js
import React from "react";
import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import AddToCartButton from "../components/AddToCartButton";

const ProductsPage = () => {
  const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <div>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2">Price: ${product.price}</Typography>
              <AddToCartButton product={product} />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsPage;
