import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/courses/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.enrolledCourses || []);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading your courses...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 My Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-500">You haven’t purchased any courses yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map(course => (
            <Link
              key={course._id}
              to={`/courses/${course.slug}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{course.name}</h2>
              <p className="text-gray-600 mt-1">{course.description.substring(0, 100)}...</p>
            </Link>
          ))}
        </div>

      )}
    </div>
  );
};

export default MyCourses;
