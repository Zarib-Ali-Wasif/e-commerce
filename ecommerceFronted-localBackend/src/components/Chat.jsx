import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000"); // Replace with your backend URL.

const Chat = () => {
  const [roomId, setRoomId] = useState(null); // Chat room ID
  const [messages, setMessages] = useState([]); // Messages state
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
        setMessages(Array.isArray(response.data) ? response.data : []);
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
    <div
      style={{
        padding: "20px",
        marginTop: "200px",
        minHeight: "60vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Quick Chat</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id || Math.random()}
                style={{ marginBottom: "10px" }}
              >
                <strong>
                  {msg.userId === userId
                    ? "You"
                    : `${msg.userId.charAt(0).toUpperCase()}${msg.userId.slice(
                        1
                      )}`}
                  :
                </strong>
                <p>{msg.content}</p>
              </div>
            ))
          ) : (
            <p>No messages yet. Start the conversation!</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={{
            width: "80%",
            padding: "8px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
