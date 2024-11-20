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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetailsModal from "./ProductDetailsModal";

const Products = ({ showModal }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { id } = useParams();
  const navigate = useNavigate();

  //     image: "https://via.placeholder.com/150",

  const [products, setProducts] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url =
          selectedCategory === "all"
            ? "https://fakestoreapi.com/products"
            : `https://fakestoreapi.com/products/category/${selectedCategory}`;
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

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
            {categories.map((category) => (
              <MenuItem
                key={category}
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
            ))}
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
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id}>
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
