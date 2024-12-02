import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

const ProductsManagement = () => {
  const products = [
    { name: "Product A", price: "$50", stock: "10" },
    { name: "Product B", price: "$75", stock: "5" },
  ];

  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card style={{ padding: "10px" }}>
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body1">Price: {product.price}</Typography>
              <Typography variant="body2" color="textSecondary">
                Stock: {product.stock}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Edit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductsManagement;
