import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  Button,
  CardMedia,
} from "@mui/material";
import api from "../../lib/services/api";
import { toast, ToastContainer } from "react-toastify";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem("userId"); // Get userId from local storage

  useEffect(() => {
    // Fetch user info by userId
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`user/findUserById/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const imageUrl = URL.createObjectURL(uploadedFile);
    setAvatar(imageUrl); // Preview the uploaded avatar
  };

  const handleAvatarSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const imageResponse = await api.post("image/upload/single", formData);
      const url = imageResponse.data.url;
      const updatedUser = {
        ...userInfo,
        avatar: url, // Assuming API returns the URL of the uploaded image
      };

      // Update user info with the new avatar
      await api.put(`user/updateById/${userId}`, updatedUser);
      setUserInfo(updatedUser); // Update state to reflect changes
      toast.success("Profile updated successfully!");
      setAvatar(url);
      setFile(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", m: 2, mb: 8 }}>
      <Paper
        sx={{
          padding: 3,
          maxWidth: 400,
          width: "100%",
          margin: "auto",
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        {/* Profile Header */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
          <label htmlFor="avatarInput">
            <Avatar
              sx={{
                width: 90,
                height: 90,
                marginRight: 2,
                border: "4px solid #1C4771",
                cursor: "pointer",
              }}
              alt="User Avatar"
              src={avatar || userInfo.avatar}
            />
          </label>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Box>
            <Typography variant="h5" color="textPrimary" fontWeight={600}>
              {userInfo.name || "Name"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userInfo.role || "Role"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Profile Details */}
        <Box sx={{ paddingBottom: 2 }}>
          <Typography variant="body1" color="textSecondary">
            <strong>Email:</strong> {userInfo.email}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Age:</strong> {userInfo.age}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Gender:</strong> {userInfo.gender}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Email Verified:</strong>{" "}
            {userInfo.is_emailVerified ? "Yes" : "No"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Active Status:</strong>{" "}
            {userInfo.is_Active ? "Active" : "Inactive"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Account Created:</strong>{" "}
            {new Date(userInfo.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Last Updated:</strong>{" "}
            {new Date(userInfo.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {/* Avatar Submit Button */}
          {file && (
            <Button
              variant="contained"
              onClick={handleAvatarSubmit}
              sx={{ mt: 2, backgroundColor: "#1C4771" }}
            >
              Submit Avatar
            </Button>
          )}
        </Box>
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default ProfilePage;
