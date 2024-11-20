import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";

const ProductDetails = () => {
  const { id } = useParams();

  // Sample product data (replace with API data or state management)
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
      description: "This is a description of Product 1.",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Product 2",
      price: 49.99,
      description: "This is a description of Product 2.",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      name: "Product 3",
      price: 19.99,
      description: "This is a description of Product 3.",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      name: "Product 4",
      price: 99.99,
      description: "This is a description of Product 4.",
      image: "https://via.placeholder.com/300",
    },
  ];

  // Find the product by ID
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <Typography variant="h4" textAlign="center" mt={4}>
        Product not found!
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{ width: "100%", borderRadius: "8px" }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Price: ${product.price}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
