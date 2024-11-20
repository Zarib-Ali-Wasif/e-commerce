import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Toolbar,
} from "@mui/material";
import ProductDetailsModal from "./ProductDetailsModal"; // Import the modal component

const Products = () => {
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [selectedProductId, setSelectedProductId] = useState(null); // State for selected product ID

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

  const handleOpenModal = (id) => {
    setSelectedProductId(id);
    setModalOpen(true); // Open the modal when a product is selected
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null); // Close the modal and reset product ID
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ padding: "20px", minHeight: "100vh", height: "100%" }}>
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
                    sx={{
                      textTransform: "none",
                      marginRight: 1,
                      backgroundColor: "#1C4771",
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", borderColor: "#1C4771" }}
                    onClick={() => handleOpenModal(product.id)} // Open the modal on click
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Product Details Modal */}
      {selectedProductId && (
        <ProductDetailsModal
          open={modalOpen}
          handleClose={handleCloseModal}
          productId={selectedProductId} // Pass the selected product ID
        />
      )}
    </>
  );
};

export default Products;
