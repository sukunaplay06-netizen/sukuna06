// EditProfile.jsx
import React, { useState } from "react";
import instance from "../api/axios";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    profilePicture: null, // Changed from avatar to profilePicture
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    if (formData.profilePicture) data.append("profilePicture", formData.profilePicture); // Changed to profilePicture

    try {
      const res = await instance.put("/auth/profile", data);
      console.log("Response from /auth/profile:", res.data);
    } catch (err) {
      console.error("Update error details:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Enter name" onChange={handleChange} />
      <input type="file" name="profilePicture" accept="image/*" onChange={handleChange} /> {/* Changed to profilePicture */}
      <button type="submit">Save Changes</button>
    </form>
  );
}