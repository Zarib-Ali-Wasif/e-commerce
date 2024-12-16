import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000"); // Update this with your backend URL.

const AdminChat = () => {
  const [chatRooms, setChatRooms] = useState([]); // List of all chat rooms.
  const [selectedRoom, setSelectedRoom] = useState(null); // Currently selected chat room.
  const [messages, setMessages] = useState([]); // Messages for the selected room.
  const [newMessage, setNewMessage] = useState(""); // Message to send.
  const [loading, setLoading] = useState(false); // Loading state for fetching rooms/messages.
  const [error, setError] = useState(""); // Error state.

  // Fetch all chat rooms on component mount.
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/chat/all");
        setChatRooms(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
        setError("Failed to fetch chat rooms. Please try again later.");
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  // Join the selected chat room and fetch messages.
  const selectRoom = async (roomId) => {
    setSelectedRoom(roomId);
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/chat/room/${roomId}`
      );
      setMessages(response.data);
      socket.emit("joinRoom", roomId); // Join the room via Socket.IO.
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages for the selected chat room.");
      setLoading(false);
    }
  };

  // Listen for new messages in real time.
  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (message.roomId === selectedRoom) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        marginTop: "200px",
      }}
    >
      {/* Sidebar for listing chat rooms */}
      <div
        style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}
      >
        <h2>Chat Rooms</h2>
        {loading && <p>Loading chat rooms...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chatRooms.map((room) => (
            <li
              key={room._id}
              onClick={() => selectRoom(room._id)}
              style={{
                padding: "10px",
                cursor: "pointer",
                background:
                  selectedRoom === room._id ? "#e0e0e0" : "transparent",
              }}
            >
              Room ID: {room._id} | Users: {room.users.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat window for the selected room */}
      <div style={{ width: "70%", padding: "10px" }}>
        {selectedRoom ? (
          <>
            <h2>Chat Room: {selectedRoom}</h2>
            <div
              style={{
                height: "70vh",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {messages.map((msg) => (
                <div key={msg._id}>
                  <strong>{msg.userId}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                style={{ flex: 1, padding: "10px", marginRight: "10px" }}
              />
              <button onClick={sendMessage} style={{ padding: "10px" }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a chat room to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
