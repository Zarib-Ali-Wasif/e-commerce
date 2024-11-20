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

const ProductDetailsModal = ({ open, handleClose, productId, products }) => {
  const product = products.find((p) => p.id === productId);

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
            xs: "90%",
            sm: "80%",
            md: "60%",
            lg: "50%",
          },
          margin: "auto",
          backgroundColor: "#dfe5f2",
          borderRadius: "8px",
          outline: "none",
          position: "relative",
        }}
      >
        {/* Close Icon */}
        <IconButton
          sx={{ position: "absolute", top: 2, right: 4 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={3}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.image}
              alt={product.title}
              sx={{
                maxHeight: "400px",
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
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Price: ${product.price}
            </Typography>
            <Typography
              variant="body2"
              textAlign="justify"
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

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, backgroundColor: "#1C4771" }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProductDetailsModal;
