import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Badge,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchProducts,
  fetchCategories,
} from "../../../lib/redux/slices/productsSlice";
import {
  deleteProduct,
  updateProduct,
} from "../../../lib/redux/slices/productsSlice"; // Assuming you have these actions
import ProductDetailsModal from "../ProductDetailsModal";
import AddProduct from "./AddProduct"; // Import your AddProduct component

const ProductsManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const {
    productsList,
    categories,
    loading,
    loadingCategories,
    loadingDelete,
    loadingUpdate,
    error,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts("all"));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    dispatch(fetchProducts(event.target.value)); // Fetch products by category
  };

  const handleOpenModal = (id) => {
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
    // setTimeout(() => {
    //   dispatch(fetchProducts("all")); // Fetch products after adding a new one
    //   dispatch(fetchCategories());
    // }, 2000);
    // toast.success("Test: Product added successfully");
  };

  const handleDeleteProduct = (productId) => {
    // Call delete API and remove from the store
    dispatch(deleteProduct(productId));
    setTimeout(() => {
      dispatch(fetchProducts("all")); // Fetch products after adding a new one
      dispatch(fetchCategories());
    }, 2000);
    toast.success("Product deleted successfully");
  };

  const handleUpdateProduct = (productId, dataToUpdate) => {
    // Call update API and update the product
    dispatch(updateProduct({ productId, dataToUpdate }));
    setTimeout(() => {
      dispatch(fetchProducts("all")); // Fetch products after adding a new one
      dispatch(fetchCategories());
    }, 2000);
    toast.success("Product updated successfully");
  };

  const handleRemoveDiscount = (productId) => {
    const dataToUpdate = {
      discount: {
        name: "none",
        discountPercent: 0,
      },
    };
    handleUpdateProduct(productId, dataToUpdate); // Remove discount
    toast.success("Discount removed successfully");
  };

  return (
    <Box sx={{ padding: "20px", minHeight: "100vh", height: "100%" }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        Manage Products
      </Typography>

      {/* Category Filter */}
      <FormControl
        variant="outlined"
        sx={{
          width: { xs: "100%", sm: "40%", md: "20%" },
          mt: { xs: 2, md: 0 },
          mb: { xs: "20px", md: "50px" },
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <InputLabel id="category-select-label">Filter by Category</InputLabel>
        <Select
          labelId="category-select-label"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <MenuItem value="all">All</MenuItem>
          {loadingCategories ? (
            <MenuItem disabled>Loading categories...</MenuItem>
          ) : (
            categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

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
          <Typography>Loading products...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {productsList.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  maxWidth: 345,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Discount Badge */}
                {product.discount?.discountPercent > 0 && (
                  <Badge
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      backgroundColor: "#387DA3",
                      color: "white",
                    }}
                  >
                    {product.discount.discountPercent}% OFF
                  </Badge>
                )}

                <CardMedia
                  component="img"
                  sx={{ width: "100%", height: "200px", objectFit: "contain" }}
                  image={product.image}
                  alt={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Price: ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Available Stock: {product.stock}{" "}
                    {/* Assuming stock is part of the product object */}
                  </Typography>

                  {product.discount?.name &&
                    product.discount.discountPercent > 0 && (
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "#387DA3", mt: 1 }}
                      >
                        Offer: {product.discount.name}
                      </Typography>
                    )}
                </CardContent>

                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#387DA3",
                      textTransform: "none",
                      borderColor: "#387DA3",
                    }}
                    onClick={() => handleOpenModal(product._id)}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ textTransform: "none", marginRight: 1 }}
                    onClick={() => handleUpdateProduct(product._id)} // You would pass the updated data here
                  >
                    Update
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{ color: "red", textTransform: "none" }}
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{ color: "#387DA3", textTransform: "none" }}
                    onClick={() => handleRemoveDiscount(product._id)}
                  >
                    Remove Discount
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          marginTop: 2,
          backgroundColor: "#1C4771",
          "&:hover": { backgroundColor: "#163b56" },
        }}
        onClick={handleAddProduct}
      >
        Add New Product
      </Button>

      <ToastContainer />

      {/* Add New Product Modal */}
      {showAddProductModal && <AddProduct />}

      {/* Product Details Modal */}
      {selectedProductId && (
        <ProductDetailsModal
          open={modalOpen}
          handleClose={handleCloseModal}
          productId={selectedProductId}
        />
      )}
    </Box>
  );
};

export default ProductsManagement;
