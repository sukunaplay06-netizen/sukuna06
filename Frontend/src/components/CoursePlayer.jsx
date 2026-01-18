import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../api/axios";

export default function CoursePlayer() {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState(null);

  // Fetch course details
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`/courses/${id}`);
        setCourse(data);
        if (data.videos.length > 0) setSelectedVideo(data.videos[0]);
      } catch (err) {
        setError("Failed to load course");
      }
    })();
  }, [id]);

  // Fetch video signed URL
  useEffect(() => {
    if (selectedVideo) {
      (async () => {
        try {
          const { data } = await instance.get(`/courses/videos/url/${selectedVideo.key}`);
          setVideoUrl(data.url);
        } catch (err) {
          setError("Failed to load video");
        }
      })();
    }
  }, [selectedVideo]);

  // Log video view when videoUrl is available
  useEffect(() => {
    if (videoUrl) {
      (async () => {
        await instance.post(`/courses/videos/view/${selectedVideo.key}`);
      })();
    }
  }, [videoUrl]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!course) return <p>Loading...</p>;

  return (
    <div className="flex">
      {/* Left side - video list */}
      <div className="w-1/4 border-r p-4">
        <h2 className="font-bold text-lg">{course.title}</h2>
        <ul>
          {course.videos.map((v, idx) => (
            <li
              key={idx}
              onClick={() => setSelectedVideo(v)}
              className={`p-2 cursor-pointer ${
                selectedVideo?.key === v.key ? "bg-blue-200" : ""
              }`}
            >
              {v.title} <span className="text-sm text-gray-500">({v.duration})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - video player */}
      <div className="w-3/4 p-4">
        <h3 className="text-xl mb-2">{selectedVideo?.title}</h3>
        {videoUrl && <video src={videoUrl} controls style={{ width: "100%" }} />}
      </div>
    </div>
  );
}