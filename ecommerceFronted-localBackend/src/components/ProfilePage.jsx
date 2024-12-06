import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, updateAvatar } from "../lib/redux/slices/usersSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, userInfoAvatar, loading } = useSelector(
    (state) => state.users
  );
  const userId = localStorage.getItem("userId"); // Get userId from local storage

  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserInfo(userId));
    }
  }, [userId, dispatch]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const imageUrl = URL.createObjectURL(uploadedFile);
    setAvatar(imageUrl); // Preview the uploaded avatar
  };

  const handleAvatarSubmit = () => {
    if (!file) return;
    dispatch(updateAvatar({ userId, file }))
      .unwrap()
      .then(() => {
        setFile(null);
        setAvatar(null);
      })
      .catch((error) => {
        console.error("Error updating avatar:", error);
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={80} />
        <Typography
          sx={{
            mt: 4,
            fontSize: { xs: "1.2rem", sm: "1.8rem" },
            fontWeight: "500",
            color: "#1C4771",
          }}
        >
          Loading ...
        </Typography>
      </Box>
    );
  }

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
              src={avatar || userInfo?.avatar}
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
              {userInfo?.name || "Name"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userInfo?.role || "Role"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        {/* Profile Details */}
        <Box sx={{ paddingBottom: 2 }}>
          <Typography variant="body1" color="textSecondary">
            <strong>Email:</strong> {userInfo?.email}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Age:</strong> {userInfo?.age}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Gender:</strong> {userInfo?.gender}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Email Verified:</strong>{" "}
            {userInfo?.is_emailVerified ? "Yes" : "No"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Active Status:</strong>{" "}
            {userInfo?.is_Active ? "Active" : "Inactive"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Account Created:</strong>{" "}
            {new Date(userInfo?.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Last Updated:</strong>{" "}
            {new Date(userInfo?.updatedAt).toLocaleDateString()}
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
