import React, { useState } from "react";
import api from "../api/axios";

function UploadCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    content: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem("token"); // Add authentication
      const res = await api.post("/courses", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Upload Course</h2>
        {message && <p className={message.includes("failed") ? "text-red-500" : "text-green-500"} text-center mb-4>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Course Title"
            required
            className="input"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="input h-24"
          />
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="file"
            name="content"
            onChange={handleChange}
            className="input"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md text-lg font-semibold"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadCourse;