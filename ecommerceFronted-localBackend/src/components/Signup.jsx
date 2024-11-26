import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "Male",
    role: "User",
    contactNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Replace with your backend endpoint
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );
      setSuccess("Signup successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "Male",
        role: "User",
        contactNumber: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h1>Sign Up</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            pattern="\d{10}"
            title="Enter a valid 10-digit phone number."
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
