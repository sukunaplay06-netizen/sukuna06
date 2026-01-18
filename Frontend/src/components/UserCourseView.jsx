import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import ReactPlayer from "react-player";
import { Button } from "../components/ui/button";

export default function UserCourseView() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      const res = await axios.get("/courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Courses data:", res.data);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    console.log("Selected course:", course);
    setSelectedCourse(course);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-800 drop-shadow-md">
        Explore Our Courses
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-red-500 text-lg">No courses found. Check API or backend.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden border border-gray-200"
              onClick={() => handleCourseClick(course)}
            >
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <CardTitle className="text-2xl font-semibold">{course.title || course.name}</CardTitle> {/* Fallback to name */}
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">Videos: {course.videos?.length || 0}</p>
                <Button
                  variant="outline"
                  className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  View Videos
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-800">{selectedCourse.title || selectedCourse.name}</h2>
            <Button
              variant="ghost"
              onClick={() => setSelectedCourse(null)}
              className="text-red-500 hover:text-red-700"
            >
              Close
            </Button>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {selectedCourse.videos && selectedCourse.videos.length > 0 ? (
              selectedCourse.videos.map((video, index) => (
                <AccordionItem
                  key={video._id || index}
                  value={`video-${index}`}
                  className="border rounded-xl overflow-hidden hover:bg-gray-50 transition-colors"
                >
                  <AccordionTrigger className="p-4 text-lg font-medium text-gray-800 bg-gray-100 hover:bg-gray-200">
                    {video.title} {video.freePreview && <span className="text-green-600">(Free)</span>}
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-white">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-inner">
                      <ReactPlayer
                        url={video.url}
                        controls
                        width="100%"
                        height="100%"
                        className="rounded-lg"
                        onError={(e) => console.error("Video error:", e)}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Preview: {video.freePreview ? "Yes" : "No"}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center text-gray-500 italic">No videos available for this course.</p>
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
}