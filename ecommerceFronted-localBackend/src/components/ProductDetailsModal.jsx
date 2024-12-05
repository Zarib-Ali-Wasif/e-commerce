import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { getProductDetails } from "../../lib/utils/helperFunctions";
import { useDispatch } from "react-redux";
import { addToCart } from "../../lib/redux/slices/cartSlice";

const ProductDetailsModal = ({
  open,
  handleClose,
  productId,
  productsList,
}) => {
  const dispatch = useDispatch();
  const product = useSelector((state) =>
    getProductDetails(productId, state.cart.productsList)
  );
  const role = localStorage.getItem("role");

  if (!product) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            padding: "20px",
            width: "30%",
            height: "10%",
            margin: "auto",
            backgroundColor: "#dfe5f2",
            borderRadius: "8px",
            outline: "none",
            position: "relative",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" textAlign="center" mt={4}>
            Product not found!
          </Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: "20px",
          width: {
            xs: "70%",
            sm: "60%",
            md: "50%",
          },
          height: {
            xs: "80%",
            sm: "auto",
          },

          backgroundColor: "#dfe5f2",
          borderRadius: "12px",
          outline: "none",
          position: "relative",
          overflowY: "auto",
          boxShadow: 5,
        }}
      >
        {/* Close Button */}
        <IconButton
          sx={{ position: "absolute", top: 2, right: 4 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.image}
              alt={product.title}
              sx={{
                maxHeight: { xs: "200px", md: "400px" }, // Adjust height for small screens
                width: "100%",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#1C4771"
              gutterBottom
            >
              {product.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {product.category}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Available Stock: {product.stock || 0}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Price: ${product.price.toFixed(2)}
            </Typography>

            {/* Conditionally Display Discount Badge */}
            {product.discount?.discountPercent > 0 && (
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: "#387DA3", // Subtle orange for badge
                  color: "white",
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  mt: 1,
                }}
              >
                {product.discount.discountPercent}% OFF -{" "}
                {product.discount.name}
              </Typography>
            )}

            <Typography
              variant="body2"
              textAlign="justify"
              mt={2}
              width={"95%"}
              paragraph
            >
              {product.description}
            </Typography>

            {/* Rating Section */}
            <Box sx={{ mt: 2, textAlign: "left" }}>
              {/* Rating Stars */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating
                  value={product.rating.rate}
                  precision={0.5}
                  readOnly
                  sx={{ color: "#FFC107", fontSize: "1.5rem", mr: 1 }} // Golden color
                />
              </Box>

              {/* Rating Number */}

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {product.rating.rate} / 5
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "14px" }}
                >
                  ({product.rating.count} reviews)
                </Typography>
              </Box>
            </Box>
            {/* If the user is an Admin, do not show the Add to Cart button */}
            {role !== "Admin" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  dispatch(addToCart(product)); // Dispatch addToCart action
                  handleClose();
                }}
                sx={{
                  mt: 4,
                  backgroundColor: "#1C4771",
                  "&:hover": { backgroundColor: "#163b56" },
                }}
              >
                Add to Cart
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProductDetailsModal;
