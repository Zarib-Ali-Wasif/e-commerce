import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CardMedia,
} from "@mui/material";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import api from "../../../lib/services/api";

const AddProduct = ({ productData, onSubmit }) => {
  const [productImage, setProductImage] = useState(productData?.image || "");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (productData) {
      formik.setValues({
        title: productData.title || "",
        description: productData.description || "",
        price: productData.price || "",
        category: productData.category || "",
      });
      setProductImage(productData.image || "");
    }
  }, [productData]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const imageUrl = URL.createObjectURL(uploadedFile) || "";
    setProductImage(imageUrl);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
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
    onSubmit: async (data) => {
      try {
        const formData = new FormData();
        if (file) {
          formData.append("image", file);
        }

        const imageResponse = file
          ? await api.post("image/upload/single", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          : { data: productImage }; // Use existing image if not uploading a new one
        const imageUrl = imageResponse.data.url || productImage; // URL of the uploaded image
        const productData = {
          ...data,
          image: imageUrl,
        };
        await onSubmit(productData); // Call the onSubmit function passed as prop

        // toast.success(productData.id ? "Product updated!" : "Product added!");
        formik.resetForm();
        setProductImage(""); // Clear the image after submission if needed
        setFile(null); // Clear the file input after form submission
      } catch (error) {
        console.error("Failed to process request", error);
        toast.error("Failed to process request, please try again.");
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
        {productData ? "Edit Product" : "Add Product"}
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
              productImage ||
              "https://placehold.co/600x400?text=Click+to+Upload+Image"
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

      <Box sx={{ width: "300px", mt: 3 }}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          variant="standard"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <Typography color="error">{formik.errors.title}</Typography>
        )}

        <TextField
          label="Description"
          name="description"
          fullWidth
          variant="standard"
          multiline
          rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mt: 2 }}
        />
        {formik.touched.description && formik.errors.description && (
          <Typography color="error">{formik.errors.description}</Typography>
        )}

        <TextField
          label="Price"
          name="price"
          fullWidth
          type="number"
          variant="standard"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ mt: 2 }}
        />
        {formik.touched.price && formik.errors.price && (
          <Typography color="error">{formik.errors.price}</Typography>
        )}

        <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
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
              Select Category
            </MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={`${category}-${index}`} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {formik.touched.category && formik.errors.category && (
          <Typography color="error">{formik.errors.category}</Typography>
        )}

        <Button
          onClick={formik.handleSubmit}
          sx={{
            mt: 4,
            width: "100%",
            bgcolor: "#1C4771",
            color: "white",
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
          {productData ? "Update Product" : "Add Product"}
        </Button>
      </Box>
      {/* <ToastContainer /> */}
    </Box>
  );
};

export default AddProduct;
