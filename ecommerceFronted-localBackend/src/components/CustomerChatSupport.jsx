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
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AttachFile, PhotoCamera, Send } from "@mui/icons-material";

const socket = io("http://localhost:3000"); // Replace with your backend URL.

const CustomerChatSupport = () => {
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
        if (!userId) {
          console.error("User ID not found in local storage.");
          alert("User ID not found in local storage.");
          return;
        }

        setLoading(true);
        setError(null);
        const response = await axios.post(
          `http://localhost:3000/chat/user/${userId}`
        );

        if (response.data.length != 0) {
          setUserAvatar(
            response.data.users.find(
              (user) => user.role === "User" && user._id === userId
            ).avatar
          );
          setAdminAvatar(
            response.data.users.find((user) => user.role === "Admin").avatar
          );
          setRoomId(response.data._id); // Assuming the API returns the room ID as `_id`
        } else {
          // If no room is found, create one
          const createRoom = async () => {
            try {
              const response = await axios.post(
                `http://localhost:3000/chat/user/${userId}`,
                {
                  users: [
                    {
                      _id: userId,
                      role: "User",
                    },
                    {
                      _id: "admin",
                      role: "Admin",
                    },
                  ],
                }
              );

              setUserAvatar(
                response.data.users.find((user) => user.role === "User").avatar
              );
              setAdminAvatar(
                response.data.users.find((user) => user.role === "Admin").avatar
              );
              setRoomId(response.data._id); // Assuming the API returns the room ID as `_id`
            } catch (err) {
              console.error("Error creating room:", err);
              setError("Failed to create chat room. Please try again.");
            }
          };

          createRoom();
        }
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
        marginTop: 15,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "70vh",
        padding: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          padding: 6,
          textAlign: "center",
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif",
          letterSpacing: "1px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          color: "#1C4771",
        }}
      >
        Customer Support
      </Typography>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "50%" },
            margin: "auto",
            backgroundColor: "#F9F9F9",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <CircularProgress sx={{ marginTop: 2, color: "#1C4771" }} />
          ) : error ? (
            <Typography
              color="error"
              sx={{
                marginTop: 2,
                fontStyle: "italic",
                fontSize: "1.1rem",
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          ) : (
            <>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  background: "linear-gradient(90deg, #1C4771, #27649D)",
                  color: "#FFF",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                <Avatar
                  src={adminAvatar}
                  alt="Admin Avatar"
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Administrator
                </Typography>
              </Box>

              {/* Chat Content */}
              <Paper
                sx={{
                  maxHeight: "40vh",
                  overflowY: "auto",
                  backgroundColor: "#FAFAFA",
                  padding: 2,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "linear-gradient(90deg, #1C4771, #27649D)",
                    borderRadius: "10px",
                  },
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg._id || Math.random()}
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.userId === "admin" ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        my: 0.4,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      {/* Admin's Avatar */}
                      {msg.userId !== "admin" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 0.6,
                            px: 0.6,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 20,
                              height: 20,
                              marginTop: 0.5,
                            }}
                            src={adminAvatar}
                          />
                          <Box
                            sx={{
                              display: "inline-block",
                              maxWidth: "70%",
                              py: 0.5,
                              px: 1.5,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[200],
                              color: "#000",
                              position: "relative",
                              zIndex: 1,
                              marginTop: 0.5,
                            }}
                          >
                            <Typography variant="body1">
                              {msg.content}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: theme.palette.grey[500],
                                textAlign: "right",
                              }}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* User's Box */}
                      {msg.userId === "admin" && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "flex-end",
                              gap: 0.5,
                              px: 0.6,
                            }}
                          >
                            <Box
                              sx={{
                                display: "inline-block",
                                maxWidth: "70%",
                                py: 0.5,
                                px: 1.5,
                                borderRadius: 2,
                                backgroundColor: "#E0F0FF",
                                color: "#000",
                                position: "relative",
                                zIndex: 1,
                                marginBottom: 0.5,
                              }}
                            >
                              <Typography variant="body1">
                                {msg.content}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.8rem",
                                  color: theme.palette.grey[500],
                                  textAlign: "right",
                                }}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  "en-US",
                                  { hour: "numeric", minute: "numeric" }
                                )}
                              </Typography>
                            </Box>
                            <Avatar
                              sx={{
                                width: 20,
                                height: 20,
                                marginBottom: 0.5,
                              }}
                              src={adminAvatar}
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Paper>

              {/* Input Section */}
              <Box
                sx={{
                  display: "flex",
                  maxWidth: "100%",
                  alignItems: "center",
                  padding: 2,
                  backgroundColor: "#FFF",
                  borderTop: "1px solid #E0E0E0",
                  gap: 2,
                }}
              >
                <TextField
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                    },
                    backgroundColor: "#F9F9F9",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <AttachFile />
                        </IconButton>
                        <IconButton>
                          <PhotoCamera />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  onClick={sendMessage}
                  variant="contained"
                  sx={{
                    backgroundColor: "#1C4771",
                    borderRadius: "50% / 70%",
                    width: 50,
                    height: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:disabled": {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    },
                    "&:hover": {
                      backgroundColor: "#27649D",
                    },
                  }}
                  disabled={!newMessage.trim()}
                >
                  <Send />
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default CustomerChatSupport;
