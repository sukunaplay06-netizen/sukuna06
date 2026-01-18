import React, { useState, useEffect } from "react";
import api from "../api/axios";

function CoursesDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // Add authentication
        const res = await api.get("/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data.courses);
        setLoading(false);
      } catch (err) {
        setError("Failed to load courses: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Courses Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={course.thumbnail || "https://via.placeholder.com/150"}
              alt={course.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h3 className="text-xl font-semibold mt-2">{course.name}</h3>
            <p className="text-gray-600 mt-1">{course.description || "No description"}</p>
            <p className="text-sm text-gray-500 mt-2">
              Uploaded by: {course.uploadedBy.firstName} ({course.uploadedBy.email})
            </p>
            {course.contentUrl && (
              <a
                href={course.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 mt-2 block hover:underline"
              >
                View Content
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesDashboard;