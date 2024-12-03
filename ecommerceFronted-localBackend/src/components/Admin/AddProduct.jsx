import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import api from "../../../lib/services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [productImage, setProductImage] = useState();
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const imageUrl = URL.createObjectURL(uploadedFile);
    setProductImage(imageUrl);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
    },
    validationSchema,
    onSubmit: async (data, { resetForm }) => {
      try {
        const formData = new FormData();
        if (file) {
          formData.append("image", file);
        }

        const imageResponse = file
          ? await api.post("image/upload/single", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          : { data: "" };

        const imageUrl = imageResponse.data || ""; // URL of the uploaded image

        const productData = {
          ...data,
          image: imageUrl, // Attach the image URL
        };

        // Send the request to create the product
        const response = await api.post("store/products", productData);

        toast.success("Product added successfully!");
        resetForm();
        localStorage.getItem("role") === "Admin" ? null : navigate("/products"); // Navigate to the products list or other desired page
      } catch (error) {
        console.error("An error occurred:", error.message);
        toast.error("Error: Failed to add product. Please try again later.");
      }
    },
  });

  const categories = [
    "Electronics",
    "Jewelry",
    "Men's Clothing",
    "Women's Clothing",
    "Fashion",
    "Home Appliances",
    "Books",
    "Health & Beauty",
    "Sports & Outdoors",
    "Toys & Games",
    "Groceries",
    "Furniture",
    "Automotive",
    "Jewelry & Watches",
    "Pet Supplies",
    "Music & Instruments",
    "Baby Products",
    "Office Supplies",
    "Footwear",
    "Gardening",
    "Hardware & Tools",
    "Other",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        textAlign: "center",
        padding: 10, // Add some padding to the container for better spacing
      }}
    >
      {/* Add Product Heading */}
      <Typography
        sx={{
          fontSize: "64px",
          fontWeight: 500,
          mb: 2,
          mt: 12,
          color: "#1C4771", // Replace with your desired color code
        }}
      >
        Add Product
      </Typography>

      {/* Product Image Section */}

      <Box sx={{ mt: 2 }}>
        <label htmlFor="productImageInput">
          <CardMedia
            component="img"
            sx={{
              width: "70%",
              height: "200px",
              objectFit: "contain",
              cursor: "pointer",
              margin: "auto",
              borderRadius: "20px",
            }}
            image={
              productImage
                ? productImage
                : "https://placehold.co/600x400?text=Click+to+Upload+Image"
            }
            alt="Product Image"
          />
        </label>
        <input
          id="productImageInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </Box>

      {/* Form Fields */}
      <Box sx={{ width: "300px", mt: 3 }}>
        <Typography sx={{ textAlign: "start" }}>Title</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="title"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <Typography color="error">{formik.errors.title}</Typography>
          ) : null}
        </Box>

        <Typography sx={{ textAlign: "start" }}>Description</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="description"
            variant="standard"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <Typography color="error">{formik.errors.description}</Typography>
          ) : null}
        </Box>

        <Typography sx={{ textAlign: "start" }}>Price</Typography>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="price"
            variant="standard"
            fullWidth
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
          />
          {formik.touched.price && formik.errors.price ? (
            <Typography color="error">{formik.errors.price}</Typography>
          ) : null}
        </Box>

        <Box sx={{ mb: 1, mt: 2.5, textAlign: "start" }}>
          <FormControl fullWidth variant="standard">
            <Select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              displayEmpty
              fullWidth
              sx={{
                height: "45px", // Set height for the select component
                "& .MuiSelect-select": {
                  paddingTop: "10px", // Adjust padding if needed to center the text vertically
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Set max height for the dropdown
                    overflowY: "auto", // Enable scrolling if the content exceeds the height
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                Category
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formik.touched.category && formik.errors.category ? (
            <Typography color="error">{formik.errors.category}</Typography>
          ) : null}
        </Box>

        {/* Add Product Button */}
        <Box>
          <Button
            onClick={formik.handleSubmit}
            sx={{
              width: "303px",
              border: "1px solid #1C4771", // Change to the desired color
              borderRadius: "4px",
              color: "#1C4771", // Button text color
              mt: 6,
              fontSize: "18px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#1C4771", // Hover background color
                color: "white", // Hover text color
              },
              "&:active": {
                backgroundColor: "#1C4771", // Active background color
                color: "white", // Active text color
              },
            }}
          >
            Add Product
          </Button>
        </Box>
        <ToastContainer />
      </Box>
    </Box>
  );
};

export default AddProduct;
