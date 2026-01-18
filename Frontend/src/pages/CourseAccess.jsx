import { Link, useNavigate } from 'react-router-dom';

function CourseAccess() {
  const navigate = useNavigate();

  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  const handleEnrollNow = () => {
    if (isLoggedIn) {
      // Redirect to user dashboard or enrollment page
      navigate('/userHome');
    } else {
      // Redirect to login page
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Unlock Your Learning Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant access to our wide range of courses and start learning today. Whether you're a freelancer, entrepreneur, or looking to upskill, we have something for everyone.
          </p>
        </section>

        {/* Benefits/Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Why Choose Our Courses?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Expert-Led Content
              </h3>
              <p className="text-gray-600">
                Learn from industry experts with years of experience in freelancing, entrepreneurship, and more.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Flexible Learning
              </h3>
              <p className="text-gray-600">
                Study at your own pace with lifetime access to course materials, available anytime, anywhere.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Practical Skills
              </h3>
              <p className="text-gray-600">
                Gain hands-on skills with real-world projects and actionable insights to boost your career.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <button
            onClick={handleEnrollNow}
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all duration-300"
          >
            {isLoggedIn ? 'Enroll Now' : 'Login to Enroll'}
          </button>
          <p className="mt-4 text-gray-600">
            Already enrolled?{' '}
            <Link to="/my-courses" className="text-orange-500 hover:text-orange-600">
              View Your Courses
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default CourseAccess;