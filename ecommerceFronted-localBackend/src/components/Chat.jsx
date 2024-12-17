import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  CircularProgress,
  Tooltip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ChatBubbleOutline,
  AttachFile,
  PhotoCamera,
  Mic,
  Search,
} from "@mui/icons-material";

const socket = io("http://localhost:3000"); // Replace with your backend URL.

const Chat = () => {
  const theme = useTheme(); // Using Material UI theme
  const [roomId, setRoomId] = useState(null); // Chat room ID
  const [messages, setMessages] = useState([]); // Messages state
  const [userAvatar, setUserAvatar] = useState(""); // User avatar
  const [adminAvatar, setAdminAvatar] = useState(""); // Admin avatar
  const [newMessage, setNewMessage] = useState(""); // New message input
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const messagesEndRef = useRef(null); // Reference for auto-scroll

  // Fetch user ID from local storage
  const userId = localStorage.getItem("userId");

  // Fetch or create room for the user
  useEffect(() => {
    const fetchOrCreateRoom = async () => {
      try {
        if (!userId) throw new Error("User ID not found in local storage.");

        setLoading(true);
        setError(null);
        const response = await axios.post(
          `http://localhost:3000/chat/user/${userId}`
        );

        setUserAvatar(
          response.data.length != 0
            ? response.data.users.find(
                (user) => user.role === "User" && user._id === userId
              ).avatar
            : null
        );
        setAdminAvatar(
          response.data.length != 0
            ? response.data.users.find((user) => user.role === "Admin").avatar
            : null
        );
        setRoomId(response.data._id); // Assuming the API returns the room ID as `_id`
      } catch (err) {
        console.error("Error fetching/creating room:", err);
        setError("Failed to fetch or create chat room. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateRoom();
  }, [userId]);

  // Fetch messages for the room
  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:3000/chat/room/${roomId}`
        );
        setMessages(
          response.data.length != 0
            ? response.data
            : [
                {
                  content: "Hey there! How can I help you today?",
                  userId: null,
                  createdAt: Date.now(),
                },
              ]
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Join room and handle incoming messages
  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", roomId);

      const handleNewMessage = (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.emit("leaveRoom", roomId);
      };
    }
  }, [roomId]);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = { content: newMessage, roomId, userId };

    try {
      socket.emit("sendMessage", message);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        marginTop: 15,
        minHeight: "60vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
        boxShadow: 3,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        border: `2px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="h4"
        color="primary"
        sx={{
          marginBottom: 3,
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif",
          letterSpacing: "1px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Chat with Admin
      </Typography>

      {loading ? (
        <CircularProgress sx={{ marginTop: 2 }} />
      ) : error ? (
        <Typography
          color="error"
          sx={{ marginTop: 2, fontStyle: "italic", fontSize: "1.1rem" }}
        >
          {error}
        </Typography>
      ) : (
        <Paper
          sx={{
            maxWidth: "600px",
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: 3,
            padding: 2,
            marginBottom: 2,
            backgroundColor: theme.palette.grey[100], // Gray background for chat box
            boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
            position: "relative",
            zIndex: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.main,
              borderRadius: "5px",
            },
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Box
                key={msg._id || Math.random()}
                sx={{
                  marginBottom: 2,
                  display: "flex",
                  justifyContent:
                    msg.userId === userId ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    my: 0.8,
                    maxWidth: "70%",
                    py: 0.5,
                    px: 1.5,
                    borderRadius: 2,
                    backgroundColor:
                      msg.userId === userId
                        ? theme.palette.primary.main
                        : theme.palette.grey[200],
                    color: msg.userId === userId ? "#fff" : "#000",
                    boxShadow: 3,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {msg.userId !== userId ? (
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        marginRight: 1,
                        border: `1px solid ${theme.palette.primary.main}`,
                      }}
                      src={adminAvatar}
                    />
                  ) : (
                    <Avatar
                      sx={{ width: 20, height: 20, marginRight: 1 }}
                      src={userAvatar}
                    />
                  )}
                  <Typography variant="body1">{msg.content}</Typography>
                  <Tooltip title="Sent at" arrow>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: theme.palette.grey[500],
                        position: "absolute",
                        bottom: "-20px",
                        right: "0px",
                        minWidth: "80px",
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              sx={{ color: theme.palette.grey[600], fontStyle: "italic" }}
            >
              <CircularProgress />
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </Paper>
      )}

      <Box sx={{ display: "flex", width: "100%", marginTop: 2 }}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          sx={{
            marginRight: 2,
            backgroundColor: theme.palette.common.white,
            borderRadius: 2,
            padding: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
            "&:focus": {
              backgroundColor: theme.palette.grey[50],
            },
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton sx={{ marginRight: 1 }} color="primary">
                  <AttachFile />
                </IconButton>
                <IconButton sx={{ marginRight: 1 }} color="primary">
                  <PhotoCamera />
                </IconButton>
                <IconButton sx={{ marginRight: 1 }} color="primary">
                  <Mic />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          color="secondary"
          sx={{
            height: "100%",
            borderRadius: 2,
            paddingX: 3,
            fontSize: "16px",
            backgroundColor: theme.palette.secondary.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
          disabled={!newMessage.trim()}
        >
          <ChatBubbleOutline sx={{ marginRight: 1 }} />
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
