// // frontend/src/pages/Dashboard.jsx
// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from '../api/axios';
// import instance from '../api/axios';

// const Dashboard = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [Courses, setCourses] = useState([]);
//   const [commissionStats, setCommissionStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [profileImage, setProfileImage] = useState(null);

//   // Log user data on mount
//   console.log('🔍 [Dashboard.jsx] User data on mount:', {
//     user,
//     hasFirstName: !!user?.firstName,
//     hasEmail: !!user?.email,
//     hasAffiliateId: !!user?.affiliateId,
//     timestamp: new Date().toISOString(),
//   });

//   // Redirect check
//   if (!user && !loading) {
//     console.log('🚫 [Dashboard.jsx] No user, redirecting to login', { timestamp: new Date().toISOString() });
//     navigate('/auth/login');
//     return null;
//   }

//   const fetchData = async () => {
//     console.time('fetchData');
//     console.log('🚀 [Dashboard.jsx] Starting fetchData', { timestamp: new Date().toISOString() });
//     setLoading(true);
//     setError(null);
//     try {
//       // Fetch user data if not available
//       let userData = user;
//       if (!user?.firstName || !user?.email || !user?.affiliateId) {
//         console.log('🔄 [Dashboard.jsx] Fetching user data from /auth/me', { timestamp: new Date().toISOString() });
//         const userRes = await axios.get('/auth/me');
//         userData = userRes.data.user;
//         setUser(userData);
//         console.log('✅ [Dashboard.jsx] /auth/me response:', { user: userData, timestamp: new Date().toISOString() });
//         localStorage.setItem('user', JSON.stringify(userData));
//       }

//       const [courseRes, commissionRes] = await Promise.all([
//         axios.get('/user/enrolled-courses'),
//         axios.get('/referral/metrics'),
//       ]);
//       console.log('✅ [Dashboard.jsx] API responses:', {
//         enrolledCourses: courseRes.data,
//         commissionMetrics: commissionRes.data,
//         timestamp: new Date().toISOString(),
//       });
//       setCourses(courseRes.data.enrolledCourses || []);
//       if (commissionRes.data && commissionRes.data.success) {
//         setCommissionStats(commissionRes.data);
//       } else {
//         setError('Commission data unavailable');
//         setCommissionStats({});
//       }
//     } catch (err) {
//       console.error('❌ [Dashboard.jsx] fetchData error:', {
//         message: err.message,
//         response: err.response?.data,
//         timestamp: new Date().toISOString(),
//       });
//       setError('Failed to load data.');
//       setCommissionStats({});
//     } finally {
//       setLoading(false);
//       console.timeEnd('fetchData');
//     }
//   };

//   useEffect(() => {
//     console.log('🔄 [Dashboard.jsx] useEffect triggered', { timestamp: new Date().toISOString() });
//     fetchData();
//   }, []);

//   // Check if user has enrolled courses after data fetch
//   useEffect(() => {
//     if (!loading && Courses.length === 0) {
//       console.log('📚 [Dashboard.jsx] No enrolled courses, redirecting to home page', { timestamp: new Date().toISOString() });
//       navigate('/');
//     }
//   }, [loading, Courses, navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null); // Clear user from context
//     navigate('/auth/login');
//     console.log('🚪 [Dashboard.jsx] User logged out', { timestamp: new Date().toISOString() });
//   };

//   const handleUploadProfileImage = async (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("profilePicture", file);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await instance.put("/auth/profile", formData, {
//         headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
//       });
//       if (res.data.user?.profilePicture) {
//         setProfileImage(res.data.user.profilePicture);
//         if (setUser) {
//           setUser((prev) => ({ ...prev, profilePicture: res.data.user.profilePicture }));
//         }
//       }
//     } catch (err) {
//       setError('Failed to upload profile picture.');
//     }
//   };

//   const handleRemoveProfileImage = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete("/auth/profile-picture", { headers: { Authorization: `Bearer ${token}` } });
//       setUser({ ...user, profilePicture: null });
//     } catch {
//       setError('Failed to remove profile picture.');
//     }
//   };


//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
//         <span className="text-indigo-700 text-xl font-semibold animate-pulse">Loading Dashboard...</span>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-12 px-4 md:px-12">
//       <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-300 pb-6">
//           <div>
//             <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
//               Dashboard
//             </h1>
//             <p className="text-lg text-gray-700 mt-3">
//               Welcome back,{" "}
//               {user?.firstName
//                 ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
//                 : user?.name || "User"}
//               !
//             </p>
//           </div>
//           <div className="flex gap-4 mt-6 md:mt-0">
//             <button
//               onClick={fetchData}
//               className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-xl hover:scale-105 transition-all"
//             >
//               🔄 Refresh
//             </button>
//             <button
//               onClick={handleLogout}
//               className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md hover:shadow-xl hover:scale-105 transition-all"
//             >
//               🚪 Log Out
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-10 border border-red-200 shadow-sm">
//             {error}
//           </div>
//         )}

//         {/* User Info + Courses */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
//           {/* User Info Card */}
//           <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
//             {/* Heading + Image in one row */}
//             <div className="flex items-center gap-4 mb-6">
//               <img
//                 src={
//                   user?.profilePicture ||
//                   profileImage ||
//                   "https://res.cloudinary.com/dxwtzb6pe/image/upload/v1757262791/n9ie1ojb4l3zgw8tq08h.webp"
//                 }
//                 alt="Profile"
//                 className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 shadow-md"
//               />
//               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
//                 User Info
//               </h2>
//             </div>


//             <div className="space-y-3">
//               <p className="text-gray-700"><strong>Name:</strong> {user?.firstName || "N/A"} {user?.lastName || ""}</p>
//               <p className="text-gray-700"><strong>Email:</strong> {user?.email || "N/A"}</p>
//               <p className="text-gray-700"><strong>Affiliate ID:</strong> {user?.affiliateId || "N/A"}</p>
//               {commissionStats && (
//                 <p className="text-gray-700"><strong>Status:</strong>
//                   <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${commissionStats.status === 'active'
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-yellow-100 text-yellow-700'}`}>
//                     {commissionStats.status || 'pending'}
//                   </span>
//                 </p>
//               )}
//             </div>
//             <div className="mt-6 flex gap-3">
//               <input type="file" accept="image/*" onChange={handleUploadProfileImage} className="hidden" id="profileImageUpload" />
//               <label
//                 htmlFor="profileImageUpload"
//                 className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
//               >
//                    🚀 Upload Image
//               </label>
//               {user?.profilePicture && (
//                 <button
//                   onClick={handleRemoveProfileImage}
//                   className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white font-medium tracking-wide shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Courses */}
//           <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Enrolled Courses</h2>
//             <Link
//               to="/my-courses"
//               className="block w-full text-center px-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-md hover:shadow-lg hover:scale-105 transition"
//             >
//               Go to My Courses
//             </Link>
//           </div>
//         </div>

//         {/* Referral Tools */}
//         <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-lg p-8 border border-indigo-100">
//           <h2 className="text-2xl font-bold text-indigo-800 mb-8 flex items-center gap-3">🔗 Referral & Commission Tools</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* My Courses */}
//             <Link
//               to="/my-courses"
//               className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-md text-center transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-3"
//             >
//               📚 My Courses
//             </Link>

//             {/* View Downline */}
//             <Link
//               to="/dashboard/referral-downline"
//               className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-md text-center transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-3"
//             >
//               👥 View Downline
//             </Link>

//             {/* Payout Settings */}
//             <Link
//               to="/dashboard/payout-settings"
//               className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold px-6 py-4 rounded-2xl shadow-md text-center transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-3"
//             >
//               💳 Payout Settings
//             </Link>

//             {/* Leaderboard */}
//             <Link
//               to="/dashboard/leaderboard"
//               className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-md text-center transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center justify-center gap-3"
//             >
//               🏆 View Leaderboard
//             </Link>

//             {/* Affiliate Account (NEW) */}
//             <Link
//               to="/dashboard/affiliate-account"
//               className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-md text-center transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center gap-3"
//             >
//               💼 Affiliate Account
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable button style
// const DashboardLink = ({ to, children, gradient }) => (
//   <Link
//     to={to}
//     className={`px-6 py-4 text-center rounded-2xl font-semibold text-white bg-gradient-to-r ${gradient} shadow-md hover:shadow-xl hover:scale-105 transition`}
//   >
//     {children}
//   </Link>
// );

// export default Dashboard;