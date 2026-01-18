import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

function Login({ onAuthSuccess = () => { } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, hasEnrolledCourses } = useContext(AuthContext);

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect');
  // const referredBy = searchParams.get('ref'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/auth/login', { email, password });
      // console.log('🎉 [Login.jsx] Login success at:', new Date().toISOString(), response.data);

      // ✅ Save token & user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // ✅ Set default Authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      // console.log('💾 [Login.jsx] Token saved at:', new Date().toISOString(), localStorage.getItem('token'));

      await login(response.data.user, response.data.token);
      // console.log('🔄 [Login.jsx] AuthContext updated with token:', response.data.token);
      console.log('✅ [Login.jsx] hasEnrolledCourses:', hasEnrolledCourses);

      setError('');
      onAuthSuccess();

      // Navigate after state update
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (response.data.user.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard', { replace: true });

      }
    } catch (err) {
      // console.log('❌ [Login.jsx] Error at:', new Date().toISOString(), err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: "url('/Login/Login.jpeg')" }}
    >

      <Link
        to="/"
        className="absolute top-6 left-6 z-50
             flex items-center gap-1.5
             bg-white
             text-gray-700
             font-medium
             px-4 py-2
             rounded-lg
             shadow-sm
             hover:shadow-md
             transition-all duration-200"
      >
        <span className="text-xl leading-none">‹</span>
        <span className="text-sm">Home</span>
      </Link>

      <div className="w-full max-w-md bg-white/90 p-8 rounded-lg shadow-md backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="input"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="input"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md text-lg font-semibold"
          >
            Log In
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/auth/signup" className="text-orange-500 font-semibold">
              Sign Up
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="text-sm text-orange-500 font-semibold mt-2 block hover:underline"
          >
            Forgot Password?
          </Link>
        </form>
      </div>
    </div>

  );
}

export default Login;




