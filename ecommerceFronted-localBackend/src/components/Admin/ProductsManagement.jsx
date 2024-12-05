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
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Modal,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchProducts,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../lib/redux/slices/productsSlice";
import ProductDetailsModal from "../ProductDetailsModal";
import ProductForm from "./ProductForm"; // Import the updated ProductForm component

const ProductsManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { productsList, categories, loading, loadingCategories } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts("all"));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    dispatch(fetchProducts(event.target.value));
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
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const handleUpdateProduct = (productId, dataToUpdate) => {
    dispatch(updateProduct({ productId, dataToUpdate })).then(() => {
      dispatch(fetchProducts("all"));
      toast.success("Product updated successfully");
    });
  };

  const handleDeleteProduct = (productId) => {
    dispatch(deleteProduct(productId)).then(() => {
      dispatch(fetchProducts("all"));
      toast.success("Product deleted successfully");
    });
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

  const openConfirmDialog = (action, product) => {
    setConfirmAction(action);
    setSelectedProduct(product);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (confirmAction === "delete") {
      handleDeleteProduct(selectedProduct._id);
    } else if (confirmAction === "removeDiscount") {
      handleRemoveDiscount(selectedProduct._id);
    }
    setConfirmOpen(false);
  };

  const [editProductData, setEditProductData] = useState(null); // State to store the product data for editing

  // Function to open ProductForm modal for editing
  const handleEditProduct = (product) => {
    setEditProductData(product);
    setShowAddProductModal(true);
  };

  // Submit handler for both add and edit
  const handleAddOrUpdateProductSubmit = (productData) => {
    if (editProductData) {
      // Update existing product
      dispatch(
        updateProduct({
          productId: editProductData._id,
          dataToUpdate: productData,
        })
      ).then(() => {
        dispatch(fetchProducts("all"));
        toast.success("Product updated successfully!");
      });
    } else {
      // Add new product
      dispatch(addProduct(productData)).then(() => {
        dispatch(fetchProducts("all"));
        toast.success("Product added successfully!");
      });
    }
    setShowAddProductModal(false);
    setEditProductData(null); // Reset edit data after submission
  };

  return (
    <Box
      sx={{
        padding: "20px",
        marginTop: 8,
        maxWidth: "100%",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 6,
          textAlign: "center",
          color: "#1C4771",
        }}
      >
        Manage Products
      </Typography>

      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Category Filter */}
        <Grid item xs={12} md={6} sx={{ mb: { xs: 2, md: 4 } }}>
          <FormControl
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: "60%", md: "40%" }, // Adjust responsive width
              mt: { xs: 2, md: 0 },
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1,
            }}
          >
            <InputLabel
              id="category-select-label"
              sx={{
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#1C4771",
                "&.Mui-focused": { color: "#387DA3" }, // Focus color
              }}
            >
              Filter by Category
            </InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              onChange={handleCategoryChange}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    "& .MuiMenuItem-root:hover": { backgroundColor: "#f0f8ff" },
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-root": {
                  fontSize: "1rem",
                  fontWeight: "500",
                  color: "#1C4771",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#387DA3",
                },
              }}
            >
              <MenuItem
                value="all"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#1C4771",
                  "&:hover": { backgroundColor: "#f0f8ff" },
                }}
              >
                All
              </MenuItem>
              {loadingCategories ? (
                <MenuItem disabled>Loading categories...</MenuItem>
              ) : (
                categories.map((category, index) => (
                  <MenuItem
                    key={index}
                    value={category}
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      color: "#1C4771",
                      "&:hover": { backgroundColor: "#f0f8ff" },
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Add Product Button */}
        <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              mt: { xs: 2, md: 4 },
              mb: { xs: 2, md: 4 },

              backgroundColor: "#1C4771",
              "&:hover": { backgroundColor: "#163b56" },
            }}
            onClick={handleAddProduct}
          >
            Add New Product
          </Button>
        </Grid>
      </Grid>

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
          {productsList.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
              <Card
                sx={{
                  maxWidth: 345,
                  height: "100%",
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
                    Available Stock: {product.stock || 0}
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

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2, // Space between icons for cleaner look
                    mb: 2,
                  }}
                >
                  {/* View Details */}
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleOpenModal(product._id)}>
                      <VisibilityOutlinedIcon sx={{ color: "#387DA3" }} />
                    </IconButton>
                  </Tooltip>

                  {/* Edit */}
                  <Tooltip title="Edit Product">
                    <IconButton onClick={() => handleEditProduct(product)}>
                      <EditOutlinedIcon sx={{ color: "#387DA3" }} />
                    </IconButton>
                  </Tooltip>

                  {/* Delete */}
                  <Tooltip title="Delete Product">
                    <IconButton
                      onClick={() => openConfirmDialog("delete", product)}
                    >
                      <DeleteOutlineOutlinedIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>

                  {/* Remove Discount */}
                  <Tooltip title="Remove Discount">
                    <IconButton
                      onClick={() =>
                        openConfirmDialog("removeDiscount", product)
                      }
                    >
                      <LocalOfferOutlinedIcon sx={{ color: "#387DA3" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to{" "}
          {confirmAction === "delete"
            ? "delete this product"
            : "remove the discount"}
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />

      <Modal
        open={showAddProductModal}
        onClose={handleCloseAddProductModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            margin: "auto",
            width: {
              xs: "90%",
              sm: "70%",
              md: "50%",
            },
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRadius: "8px",
            outline: "none",
            position: "relative",
          }}
        >
          <ProductForm
            productData={editProductData}
            onSubmit={handleAddOrUpdateProductSubmit}
            onClose={handleCloseAddProductModal}
          />
        </Box>
      </Modal>

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
