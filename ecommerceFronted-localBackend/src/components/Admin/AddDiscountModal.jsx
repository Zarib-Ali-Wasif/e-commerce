import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddDiscountModal = ({ categories, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setOfferName("");
    setDiscountPercent("");
    setSelectedCategory("");
  };

  const handleSubmit = () => {
    onSubmit({ offerName, discountPercent, selectedCategory });
    resetForm();
    handleClose(); // Close the modal after submission
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Apply Offer / Add Discount
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

          <h2 style={{ textAlign: "center" }}>Add Offer / Discount</h2>

          {/* Offer Name */}
          <TextField
            fullWidth
            label="Offer Name"
            type="text"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            margin="normal"
          />

          {/* Discount Percent */}
          <TextField
            fullWidth
            label="Discount Percent"
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            margin="normal"
            inputProps={{ min: 0, max: 100 }}
          />

          {/* Categories Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Set a fixed height for the dropdown
                    overflow: "auto", // Enable scrolling for overflow
                  },
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
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            fullWidth
            sx={{ marginTop: "20px" }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AddDiscountModal;
