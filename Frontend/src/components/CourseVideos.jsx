//Frontend/src/components/CourseVideos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CourseVideos() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  // video edit states
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editVideoTitle, setEditVideoTitle] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editVideoFree, setEditVideoFree] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      console.log("[CourseVideos] Fetching courses with token:", token ? "Token present" : "No token");
      const res = await axios.get("https://guru-rohan2.onrender.com/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log("[CourseVideos] Courses fetched:", {
        count: res.data.length,
        courses: res.data.map((c) => ({ id: c._id, name: c.name, slug: c.slug })),
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Refresh selected course by slug
  const refreshSelectedCourse = async (slug) => {
    try {
      console.log(`[CourseVideos] Refreshing course for slug: ${slug}`);
      const res = await axios.get(
        `https://guru-rohan2.onrender.com/api/courses/slug/${slug}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[CourseVideos] Refreshed course data:", {
        id: res.data._id,
        name: res.data.name,
        hasPurchased: res.data.hasPurchased,
        videos: res.data.videos.map((v) => ({
          title: v.title,
          url: v.url ? "Included" : "Hidden",
          freePreview: v.freePreview,
        })),
      });
      setSelectedCourse(res.data);
    } catch (err) {
      console.error("[CourseVideos] Error refreshing course:", err.response?.data || err.message);
    }
  };

  // Add video
  const handleAddVideo = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const url = e.target.url.value;
    const freePreview = e.target.freePreview?.checked || false;

    if (!selectedCourse?._id) {
      console.error("[CourseVideos] No course selected to add video");
      return;
    }

    try {
      console.log("[CourseVideos] Adding video:", { courseId: selectedCourse._id, title, url, freePreview });
      const res = await axios.post(
        `https://guru-rohan2.onrender.com/api/courses/${selectedCourse._id}/videos`,
        { title, url, freePreview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[CourseVideos] Video added successfully:", res.data);
      await refreshSelectedCourse(selectedCourse.slug);
      e.target.reset();
    } catch (err) {
      console.error("[CourseVideos] Error adding video:", err.response?.data || err.message);
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    try {
      console.log(`[CourseVideos] Deleting video: ${videoId} from course: ${selectedCourse._id}`);
      const res = await axios.delete(
        `https://guru-rohan2.onrender.com/api/courses/${selectedCourse._id}/videos/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[CourseVideos] Video deleted successfully:", res.data);
      await refreshSelectedCourse(selectedCourse.slug);
    } catch (err) {
      console.error("[CourseVideos] Error deleting video:", err.response?.data || err.message);
    }
  };

  // Edit video
  const startEditVideo = (video) => {
    console.log("[CourseVideos] Starting edit for video:", { id: video._id, title: video.title, url: video.url, freePreview: video.freePreview });
    setEditingVideoId(video._id);
    setEditVideoTitle(video.title);
    setEditVideoUrl(video.url);
    setEditVideoFree(video.freePreview);
  };

  const handleUpdateVideo = async (videoId) => {
    try {
      console.log("[CourseVideos] Updating video:", { videoId, title: editVideoTitle, url: editVideoUrl, freePreview: editVideoFree });
      const res = await axios.put(
        `https://guru-rohan2.onrender.com/api/courses/${selectedCourse._id}/videos/${videoId}`,
        {
          title: editVideoTitle,
          url: editVideoUrl,
          freePreview: editVideoFree,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[CourseVideos] Video updated successfully:", res.data);
      await refreshSelectedCourse(selectedCourse.slug);
      setEditingVideoId(null);
    } catch (err) {
      console.error("[CourseVideos] Error updating video:", err.response?.data || err.message);
    }
  };

  // Enable edit mode for course
  const startEditCourse = (course) => {
    console.log("[CourseVideos] Starting course edit:", { id: course._id, name: course.name, slug: course.slug });
    setSelectedCourse(course);
    setEditName(course.name);
    setEditSlug(course.slug);
    setEditMode(true);
  };

  // Save course edits
  const handleSaveEdit = async () => {
    try {
      console.log("[CourseVideos] Saving course edits:", { id: selectedCourse._id, name: editName, slug: editSlug });
      const res = await axios.put(
        `https://guru-rohan2.onrender.com/api/courses/${selectedCourse._id}`,
        { name: editName, slug: editSlug, title: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[CourseVideos] Course updated successfully:", res.data);
      setEditMode(false);
      await fetchCourses();
      await refreshSelectedCourse(editSlug);
    } catch (err) {
      console.error("[CourseVideos] Error updating course:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📚 Manage Course Videos</h2>

      {/* Courses table */}
      <div className="overflow-x-auto shadow-md rounded-lg mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <th className="p-3 text-left">Course Name</th>
              <th className="p-3 text-left">Slug (URL)</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Instructor</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No courses available.
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold text-gray-700">{c.name}</td>
                  <td className="p-3 text-gray-600">{c.slug}</td>
                  <td className="p-3 text-gray-700">₹{c.price || 0}</td>
                  <td className="p-3 text-gray-600">{c.instructor || "N/A"}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg shadow-sm"
                      onClick={() => setSelectedCourse(c)}
                    >
                      Manage
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg shadow-sm"
                      onClick={() => startEditCourse(c)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Course Modal */}
      {editMode && (
        <div className="p-6 border bg-white rounded-xl shadow-lg mb-6">
          <h3 className="font-bold mb-4 text-lg text-gray-800">✏️ Edit Course</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-2 rounded-lg focus:ring focus:ring-indigo-300"
              placeholder="Course Name"
            />
            <input
              type="text"
              value={editSlug}
              onChange={(e) => setEditSlug(e.target.value)}
              className="border p-2 rounded-lg focus:ring focus:ring-indigo-300"
              placeholder="Course Slug"
            />
            <div className="flex gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow-sm"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected course video management */}
      {selectedCourse && !editMode && (
        <div className="mt-4 border p-6 rounded-xl bg-white shadow-md">
          <h3 className="font-bold text-xl mb-4 text-gray-800">
            🎬 Videos for {selectedCourse.name}
          </h3>

          {/* Video list */}
          <ul className="mb-4">
            {selectedCourse.videos?.length > 0 ? (
              selectedCourse.videos.map((v) => (
                <li
                  key={v._id}
                  className="border p-3 mb-2 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
                >
                  {editingVideoId === v._id ? (
                    <div className="flex flex-col gap-2 flex-1">
                      <input
                        type="text"
                        value={editVideoTitle}
                        onChange={(e) => setEditVideoTitle(e.target.value)}
                        className="border p-1 rounded"
                      />
                      <input
                        type="text"
                        value={editVideoUrl}
                        onChange={(e) => setEditVideoUrl(e.target.value)}
                        className="border p-1 rounded"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editVideoFree}
                          onChange={(e) => setEditVideoFree(e.target.checked)}
                          className="accent-green-500"
                        />
                        Free Preview
                      </label>
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleUpdateVideo(v._id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                          onClick={() => setEditingVideoId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong className="text-gray-800">{v.title}</strong> -{" "}
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          Watch
                        </a>
                        {v.freePreview && (
                          <span className="ml-2 text-green-600 font-semibold">
                            (Free Preview)
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow-sm"
                          onClick={() => startEditVideo(v)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm"
                          onClick={() => handleDeleteVideo(v._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500 italic">No videos added yet.</p>
            )}
          </ul>

          {/* Add video form */}
          <form
            onSubmit={handleAddVideo}
            className="flex flex-wrap items-center gap-3"
          >
            <input
              type="text"
              name="title"
              placeholder="Video Title"
              className="border p-2 rounded-lg focus:ring focus:ring-indigo-300 flex-1"
              required
            />
            <input
              type="text"
              name="url"
              placeholder="Video URL"
              className="border p-2 rounded-lg focus:ring focus:ring-indigo-300 flex-1"
              required
            />
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" name="freePreview" className="accent-green-500" />
              Free Preview
            </label>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Add Video
            </button>
          </form>
        </div>
      )}
    </div>
  );
}