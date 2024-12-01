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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Badge,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsModal from "../components/ProductDetailsModal";
import {
  fetchProducts,
  fetchCategories,
} from "../../lib/redux/slices/productsSlice";
import { addToCart, updateCartSummary } from "../../lib/redux/slices/cartSlice";

const Products = ({ showModal }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing products and categories from the Redux store
  const { productsList, categories, loading, loadingCategories, error } =
    useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);

  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(fetchProducts("all")); // Fetch all products initially
    dispatch(fetchCategories()); // Fetch product categories
  }, [dispatch]);

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    dispatch(fetchProducts(event.target.value)); // Fetch products based on selected category on change of category selection in dropdown list.
  };

  // Open modal when `showModal` is true and `id` is valid
  useEffect(() => {
    if (showModal && id) {
      setSelectedProductId(id);
      setModalOpen(true);
    }
  }, [id, showModal]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
    navigate("/products");
  };

  const handleOpenModal = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <>
      <Box sx={{ padding: "20px", minHeight: "100vh", height: "100%", mt: 18 }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          Our Products
        </Typography>

        {/* Category Filter */}
        <FormControl
          variant="outlined"
          sx={{
            width: { xs: "100%", sm: "40%", md: "20%" }, // Responsive width
            mt: { xs: 2, md: 0 },
            mb: { xs: "20px", md: "50px" },
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1, // Ensure it's above other elements
          }}
        >
          <InputLabel
            id="category-select-label"
            sx={{
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#1C4771",
              "&.Mui-focused": {
                color: "#387DA3", // Color on focus
              },
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
                  maxHeight: 300, // Limit dropdown height
                  "& .MuiMenuItem-root:hover": { backgroundColor: "#f0f8ff" },
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" }, // Remove outline
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" }, // Remove hover outline
              "& .MuiSelect-root": {
                fontSize: "1rem",
                fontWeight: "500",
                color: "#1C4771",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#387DA3", // Border on focus
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
            {productsList.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product._id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  {/* Conditional Rendering for Discount Badge */}
                  {product.discount?.discountPercent > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        backgroundColor: "#387DA3",
                        color: "white",
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {product.discount.discountPercent}% OFF
                    </Box>
                  )}

                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                      mt: product.discount?.discountPercent > 0 ? 3 : 0,
                    }}
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {product.title}
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      Price: ${product.price.toFixed(2)}
                    </Typography>

                    {/* Only show offer name if discount name exists and is valid */}
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
                      variant="contained"
                      onClick={() => {
                        dispatch(addToCart(product));
                        dispatch(updateCartSummary(productsList));
                      }}
                      sx={{
                        textTransform: "none",
                        marginRight: 1,
                        backgroundColor: "#1C4771",
                        "&:hover": {
                          backgroundColor: "#163b56",
                        },
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
                      onClick={() => handleOpenModal(product._id)}
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
      <ToastContainer />

      {/* Product Details Modal */}
      {selectedProductId && (
        <ProductDetailsModal
          open={modalOpen}
          handleClose={handleCloseModal}
          productId={selectedProductId}
          productsList={productsList}
        />
      )}
    </>
  );
};

export default Products;
