import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // ⚡ Updated URL to match backend
        const res = await axios.get(`https://guru-rohan2.onrender.com/api/courses/slug/${slug}`);
            console.log("Course Response:", res.data); 
            console.log("Course data:", res.data);
        setCourse(res.data);
        if (res.data.videos && res.data.videos.length > 0) {
          setSelectedVideo(res.data.videos[0]);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
      <p className="mb-4">{course.description}</p>
      <p className="mb-4 font-semibold">Instructor: {course.instructor}</p>
      <p className="mb-4">Duration: {course.duration}</p>

      {/* Video Player */}
      {selectedVideo && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{selectedVideo.title}</h2>
          <video
            key={selectedVideo.url}
            src={selectedVideo.url}
            controls
            className="w-full rounded-lg"
          />
          {selectedVideo.description && <p className="mt-2">{selectedVideo.description}</p>}
        </div>
      )}

      {/* Video List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Lessons</h3>
        <ul>
          {course.videos.map((video, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-200 rounded ${selectedVideo?.url === video.url ? 'bg-gray-300' : ''}`}
              onClick={() => setSelectedVideo(video)}
            >
              {video.title} {video.freePreview && <span className="text-green-600">(Free Preview)</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetail;
