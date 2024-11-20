import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const Products = () => {
  // Sample product data (replace with API data or state management)
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Product 2",
      price: 49.99,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Product 3",
      price: 19.99,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Product 4",
      price: 99.99,
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        Our Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                maxWidth: 345,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Price: ${product.price}
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none", marginRight: 1 }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ textTransform: "none" }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    View Details
                  </Link>
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Products;
