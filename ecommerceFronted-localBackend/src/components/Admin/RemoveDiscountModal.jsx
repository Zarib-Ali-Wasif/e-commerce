import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RemoveDiscountModal = ({ offers, categories, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedOffer("");
    setSelectedCategory("");
  };
  const handleSubmit = () => {
    onSubmit({ selectedOffer, selectedCategory });
    resetForm();
    handleClose(); // Close the modal after submission
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleOpen}>
        Remove Offer / Discount
      </Button>

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
            width: "90%",
            maxWidth: "400px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            position: "relative",
            boxShadow: 24,
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 10, right: 10 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" textAlign="center" mb={2}>
            Remove Offer / Discount
          </Typography>

          {/* Offer Name Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Offer Name </InputLabel>
            <Select
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {offers.map((offer, index) => (
                <MenuItem key={index} value={offer}>
                  {offer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category </InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="error">
            Note: Selecting a category will remove offers from all products in
            that category. Choosing an offer name will remove it only from
            applicable products. Leave both empty to remove all offers.
          </Typography>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            fullWidth
            sx={{ marginTop: "20px" }}
          >
            Remove Discount
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default RemoveDiscountModal;
