// src/pages/ProductsPage.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { fetchProducts } from "../redux/productSlice";
import AddToCartButton from "../components/AddToCartButton";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
              </CardContent>
              <CardActions>
                <AddToCartButton product={product} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsPage;
