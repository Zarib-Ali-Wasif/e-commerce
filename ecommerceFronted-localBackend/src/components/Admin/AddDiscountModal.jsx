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
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddDiscountModal = ({ categories, onSubmit, open, onClose }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const resetForm = () => {
    setOfferName("");
    setDiscountPercent("");
    setSelectedCategory("");
  };

  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  const handleSubmit = () => {
    onSubmit({ offerName, discountPercent, selectedCategory });
    resetForm();
    onClose(); // Call onClose function to close the modal
    handleConfirmClose(); // Close the confirmation dialog
  };

  return (
    <>
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
            Add Offer / Discount
          </Typography>

          <TextField
            fullWidth
            label="Offer Name"
            type="text"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Discount Percent"
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            margin="normal"
            inputProps={{ min: 0, max: 100 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflow: "auto",
                  },
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmOpen}
            fullWidth
            sx={{ marginTop: "20px" }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to apply this offer with a{" "}
            <strong>{discountPercent}%</strong> discount to{" "}
            {selectedCategory === "all"
              ? "all categories"
              : `the category "${selectedCategory}"`}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="success">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddDiscountModal;
