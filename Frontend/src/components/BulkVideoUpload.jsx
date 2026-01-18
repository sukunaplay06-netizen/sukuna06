import { useState } from 'react';

function BulkVideoUpload() {
  const [courseSlug, setCourseSlug] = useState('');
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('courseSlug', courseSlug);
    videos.forEach((video) => formData.append('videos', video));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://guru-rohan2.onrender.com/api/videos/upload-videos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Videos uploaded successfully!');
      } else {
        setMessage(`Error: ${data.message || 'Upload failed'}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Upload Videos</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          value={courseSlug}
          onChange={(e) => setCourseSlug(e.target.value)}
          placeholder="Course Slug (e.g., digital-marketing-mastery)"
          required
        />
        <input
          type="file"
          multiple
          onChange={(e) => setVideos([...e.target.files])}
          accept="video/*"
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default BulkVideoUpload;