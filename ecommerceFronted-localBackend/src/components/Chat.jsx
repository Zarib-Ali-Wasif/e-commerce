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
import { AttachFile, PhotoCamera, Send } from "@mui/icons-material";

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
        color="primary"
        sx={{
          paddingBottom: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontFamily: "'Roboto', sans-serif",
          letterSpacing: "1px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Customer Support
      </Typography>

      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "50%" },
          margin: "auto",
        }}
      >
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
              width: "100%",
              maxHeight: "50vh",
              overflowY: "auto",
              borderRadius: 3,
              px: 0.5,
              marginBottom: 2,
              backgroundColor: theme.palette.grey[100], // Gray background for chat box
              boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
              position: "relative",
              zIndex: 1,
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.primary.main,
                borderRadius: "5px",
              },
            }}
          >
            {messages.map((msg) => (
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
                    my: 0.4,
                    display: "flex",
                    flexDirection: "row", // Default flex direction
                    alignItems: "flex-start", // Align avatars and content to the top
                    width: "100%", // Ensure full width to avoid horizontal scroll
                  }}
                >
                  {/* Admin's Avatar */}
                  {msg.userId !== userId && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 0.6,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 20,
                          height: 20,
                          marginTop: 0.5, // Add margin below avatar for spacing
                        }}
                        src={adminAvatar}
                      />
                      {/* Admin's Content */}
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
                          marginTop: 0.5, // Add space above content
                        }}
                      >
                        <Typography variant="body1">{msg.content}</Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: theme.palette.grey[500],
                            textAlign: "right",
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* User's Content */}
                  {msg.userId === userId && (
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
                          paddingTop: 0.5,
                        }}
                      >
                        {/* User's Content */}
                        <Box
                          sx={{
                            display: "inline-block",
                            maxWidth: "70%",
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 2,
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                            position: "relative",
                            zIndex: 1,
                            marginBottom: 0.5, // Add space below content
                          }}
                        >
                          <Typography variant="body1">
                            {msg.content}{" "}
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

                        {/* User's Avatar */}
                        <Avatar
                          sx={{
                            width: 20,
                            height: 20,
                            marginBottom: 0.5, // Add margin below avatar for spacing
                          }}
                          src={userAvatar}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}

            <div ref={messagesEndRef} />
          </Paper>
        )}

        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            px: 0.5,
            gap: 1,
            mt: 4,
          }}
        >
          <TextField
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: theme.palette.common.white,
              borderRadius: 2,
              // padding: 1.5,
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
            color="primary"
            sx={{
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
            }}
            disabled={!newMessage.trim()}
          >
            <Send />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
