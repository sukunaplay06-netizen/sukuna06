import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function UserHome() {
  const [user, setUser] = useState({
    name: 'User',
    enrolledCourses: [],
    affiliateId: '',
    affiliateEarnings: 0,
  });
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // ✅ Correct port 5001
        const userResponse = await fetch('https://guru-rohan2.onrender.com/api/courses/enrolled', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(userData.message || 'Failed to fetch user data');
        }

        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        setUser({
          ...userData,
          affiliateId: storedUser.affiliateId || '',
          affiliateEarnings: storedUser.affiliateEarnings || 0,
        });

        // ✅ Correct port 5001
        const coursesResponse = await fetch('https://guru-rohan2.onrender.com/api/courses/all');
        const allCourses = await coursesResponse.json();
        if (!coursesResponse.ok) {
          throw new Error(allCourses.message || 'Failed to fetch courses');
        }

        const enrolledCourseNames = userData.enrolledCourses.map(
          (course) => course.courseName
        );

        const recommended = allCourses
          .filter((course) => !enrolledCourseNames.includes(course.name))
          .map((course) => course.name);

        setRecommendedCourses(recommended);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        if (err.message.includes('Token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/auth/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome, {user.name}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You’re now a member of leadsgurukul. Access your courses, track your progress, and take your freelancing journey to the next level!
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-all duration-300"
          >
            Log Out
          </button>
        </section>

        {/* Affiliate Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Affiliate Program</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-gray-600 mb-4">
              Your Affiliate ID: <span className="font-semibold">{user.affiliateId}</span>
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Affiliate Earnings: ₹{user.affiliateEarnings.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-4">
              Share this link to earn commissions on course purchases:
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-orange-500">
                {`https://guru-rohan2.onrender.com/all-courses?affiliateId=${user.affiliateId}`}
              </span>
            </p>
          </div>
        </section>

        {/* Purchased Courses Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Purchased Courses</h2>
          {user.enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {user.enrolledCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {course.courseName}
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Progress: {course.progress}%</p>
                  <Link
                    to={`/courses/${course.courseName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-all duration-300"
                  >
                    Continue Learning →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">You haven’t purchased any courses yet.</p>
              <Link
                to="/all-courses"
                className="inline-block text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200"
              >
                Explore Courses →
              </Link>
            </div>
          )}
        </section>

        {/* Recommended Courses Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recommended for You</h2>
          {recommendedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{course}</h3>
                  <Link
                    to={`/courses/${course.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-block text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No recommended courses available.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserHome;
