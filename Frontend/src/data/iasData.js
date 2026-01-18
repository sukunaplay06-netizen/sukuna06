export const iasCourse = {
  _id: "ias-course-id", // Placeholder, backend se actual ID lein
  title: "IAS Preparation Course",
  slug: "ias-preparation",
  videos: Array.from({ length: 35 }, (_, i) => ({
    _id: `ias-video-${i + 1}`, // Placeholder
    title: `Video ${i + 1}: IAS Topic ${i + 1}`,
    url: `https://example.com/ias-video${i + 1}.mp4`, // Replace with real URLs
    freePreview: i < 5, // First 5 videos free
  })),
};