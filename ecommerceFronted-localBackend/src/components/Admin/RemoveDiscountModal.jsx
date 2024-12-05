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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RemoveDiscountModal = ({
  offers,
  categories,
  onSubmit,
  open,
  onClose,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const resetForm = () => {
    setSelectedOffer("");
    setSelectedCategory("");
  };

  const handleRemoveClick = () => {
    setConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmClose = () => setConfirmOpen(false);

  const handleConfirmSubmit = () => {
    onSubmit({ selectedOffer, selectedCategory });
    resetForm();
    setConfirmOpen(false); // Close confirmation dialog
    onClose(); // Close the main modal
  };

  return (
    <>
      {/* Main Modal */}
      <Modal
        open={open}
        onClose={onClose}
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
            maxWidth: { xs: "250px", sm: "400px" },
            backgroundColor: "#fff",
            borderRadius: "8px",
            position: "relative",
            boxShadow: 24,
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5 }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h6"
            fontWeight={"bold"}
            textAlign="center"
            mb={2}
            pt={2}
          >
            Remove Offer / Discount
          </Typography>

          {/* Offer Name Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Offer Name</InputLabel>
            <Select
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Set a fixed height for the dropdown
                    overflow: "auto", // Enable scrolling for overflow
                  },
                },
              }}
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

          <Typography variant="body1" sx={{ color: "#ff2000" }}>
            Note:
          </Typography>
          <Box variant="body2" color="error">
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "#ff2000",
                fontSize: "12px",
              }}
            >
              <li>
                Selecting a category will remove offers from all products in
                that category.
              </li>
              <li>
                Choosing an offer name will remove it only from applicable
                products.
              </li>
              <li>Leave both empty to remove all offers.</li>
            </ul>
          </Box>

          {/* Open Confirmation Dialog */}
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveClick}
            fullWidth
            sx={{ marginTop: "20px" }}
          >
            Remove Discount
          </Button>
        </Box>
      </Modal>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Are you sure you want to remove the selected offer or discount? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RemoveDiscountModal;
