import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProductDetailsModal from "./ProductDetailsModal";

const Products = ({ showModal }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();

  //     image: "https://via.placeholder.com/150",

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Open modal when `showModal` is true and `id` is valid
  useEffect(() => {
    if (showModal && id) {
      setSelectedProductId(parseInt(id));
      setModalOpen(true);
    }
  }, [id, showModal]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
    navigate("/products"); // Remove the product ID from the URL
  };

  const handleOpenModal = (id) => {
    navigate(`/products/${id}`); // Update the URL with the product ID
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ padding: "20px", minHeight: "100vh", height: "100%" }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Our Products
        </Typography>

        {/* Show loader while fetching products */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress size={100} />
            <Typography
              sx={{
                mt: 4,
                fontSize: { xs: "1.2rem", sm: "1.8rem" },
                fontWeight: "500",
                color: "#1C4771",
              }}
            >
              Loading products...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
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
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                    }}
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {product.title}
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
                      sx={{
                        color: "#387DA3",
                        textTransform: "none",
                        borderColor: "#387DA3",
                      }}
                      onClick={() => handleOpenModal(product.id)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Product Details Modal */}
      {selectedProductId && (
        <ProductDetailsModal
          open={modalOpen}
          handleClose={handleCloseModal}
          productId={selectedProductId}
          products={products}
        />
      )}
      <Toolbar />
    </>
  );
};

export default Products;
