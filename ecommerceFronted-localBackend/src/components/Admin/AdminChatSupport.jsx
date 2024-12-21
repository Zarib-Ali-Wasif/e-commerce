import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
  IconButton,
  Grid,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AttachFile, PhotoCamera, Send } from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL); // Update with your backend URL.

const AdminChatSupport = () => {
  const theme = useTheme(); // Using Material UI theme
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(""); // User avatar
  const [adminAvatar, setAdminAvatar] = useState(""); // Admin avatar
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({}); // Keeps track of unread messages by room ID
  const messagesEndRef = useRef(null); // Reference for auto-scroll

  // Fetch chat rooms
  useEffect(() => {
    const fetchAndJoinChatRooms = async () => {
      try {
        setListLoading(true);
        const response = await axios.get(`${API_URL}chat/all`);
        const rooms = response.data;
        setChatRooms(rooms);

        rooms.forEach((room) => {
          socket.emit("joinRoom", room._id);
        });
        setListLoading(false);
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
        setListLoading(false);
      }
    };

    fetchAndJoinChatRooms();

    return () => {
      chatRooms.forEach((room) => {
        socket.emit("leaveRoom", room._id);
      });
    };
  }, []);

  // Handle incoming messages
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.roomId === selectedRoom) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      } else {
        setUnreadMessages((prev) => ({
          ...prev,
          [message.roomId]: (prev[message.roomId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedRoom]);

  // Select user room
  const selectUserRoom = async (userId) => {
    setMessages([]); // Clear messages when a new user is selected
    setSelectedUser(userId);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}chat/user/${userId}`);
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
      const roomId = response.data._id;
      setSelectedRoom(roomId);

      // Reset unread messages for the selected room
      setUnreadMessages((prev) => ({ ...prev, [roomId]: 0 }));
    } catch (err) {
      console.error("Error fetching/creating room:", err);
      setError("Failed to fetch or create chat room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for the selected room
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedRoom) return;
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}chat/room/${selectedRoom}`);
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
  }, [selectedRoom]);

  // Send a new message.
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages.

    const messageData = {
      content: newMessage,
      roomId: selectedRoom,
      userId: "admin", // Assume "admin" as the user for this example.
    };

    try {
      socket.emit("sendMessage", messageData); // Send the message via Socket.IO.
      setNewMessage(""); // Clear the input field.
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        marginTop: 15,
        height: "85vh",
        width: "100%",
      }}
    >
      {/* Sidebar for chat rooms */}
      <Grid
        item
        xs={12}
        sm={4}
        md={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F3F6FA",
          mb: { xs: 4, md: 0 },
        }}
      >
        <Box>
          {/* Header */}
          <Box
            sx={{
              padding: "28px 16px",
              background: "linear-gradient(90deg, #1C4771, #27649D)",
              color: "#FFF",
              textAlign: "center",
              position: "sticky",
              top: 0, // Ensure the header stays at the top
              zIndex: 10, // To make sure it's above other elements
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
              }}
            >
              Customer Support
            </Typography>
          </Box>

          {/* Chat rooms list */}
          <List
            sx={{
              padding: "4px",
              height: "74vh",
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "linear-gradient(90deg, #1C4771, #27649D)",
                borderRadius: "10px",
              },
            }}
          >
            {listLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress sx={{ color: "#1C4771" }} />
              </Box>
            ) : (
              chatRooms.map((room) => (
                <ListItem
                  key={room._id}
                  disablePadding
                  sx={{
                    marginBottom: "8px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#EDF4FF",
                    },
                  }}
                >
                  <ListItemButton
                    sx={{
                      gap: "8px",
                      borderRadius: "8px",
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: "#EDF4FF",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#1C4771",
                        color: "#FFF",
                        "&:hover": {
                          backgroundColor: "#27649D",
                        },
                      },
                    }}
                    selected={selectedRoom === room._id}
                    onClick={() => selectUserRoom(room.users[0]._id)}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={unreadMessages[room._id] || 0}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "#1C4771",
                            color: "#FFFFFF",
                          },
                        }}
                        overlap="rectangular"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <Avatar
                          alt={room.users[0].name}
                          src={room.users[0].avatar}
                          sx={{
                            width: 50,
                            height: 50,
                            border: "2px solid #1C4771",
                          }}
                        >
                          {room.users[0].name[0]}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            "&:hover .email": {
                              display: "block", // Show the email on hover
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color:
                                selectedRoom === room._id ? "#FFF" : "#1C4771",
                            }}
                          >
                            {room.users[0].name}
                          </Typography>
                          <Typography
                            className="email"
                            sx={{
                              fontSize: "0.9rem",
                              color:
                                selectedRoom === room._id
                                  ? "#E0E0E0"
                                  : "#6A6A6A",
                              display: "none", // Hide the email by default
                              transition: "all 0.3s ease",
                              // marginTop: "4px", // Optional: Adds space between the name and email
                            }}
                          >
                            {room.users[0].email}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Grid>

      {/* Chat Box */}
      <Grid
        item
        xs={12}
        sm={8}
        md={9}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%" },
            margin: "auto",
            backgroundColor: "#F9F9F9",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress sx={{ color: "#1C4771" }} />
            </Box>
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
              {selectedUser && (
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
                      src={userAvatar}
                      alt="User Avatar"
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {chatRooms
                        .find((room) =>
                          room.users.some((user) => user._id === selectedUser)
                        )
                        ?.users.find((user) => user._id === selectedUser)
                        ?.name || "User"}
                    </Typography>
                  </Box>

                  {/* Chat Content */}
                  <Paper
                    sx={{
                      maxHeight: "50vh",
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
                            flexDirection: "row", // Default flex direction
                            alignItems: "flex-start", // Align avatars and content to the top
                            width: "100%", // Ensure full width to avoid horizontal scroll
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
                                  marginTop: 0.5, // Add margin below avatar for spacing
                                }}
                                src={userAvatar}
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

                          {/* User's Box  */}
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
                                {/* User's Content */}
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
                          backgroundColor:
                            theme.palette.action.disabledBackground,
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
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdminChatSupport;
