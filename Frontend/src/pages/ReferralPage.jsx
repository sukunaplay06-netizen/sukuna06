import React from 'react'

function ReferralPage() {
  return (
    <div>ReferralPage</div>
  )
}

export default ReferralPage


// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import axios from '../api/axios';
// import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

// function ReferralPage() {
//   const { user } = useContext(AuthContext);
//   const [referrals, setReferrals] = useState([]);
//   const [referralLink, setReferralLink] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     const fetchReferrals = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('/referral');
//         setReferrals(response.data.referrals || []);
//         setReferralLink(`${window.location.origin}/signup?ref=${response.data.referralCode}`);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load referral details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReferrals();
//   }, []);

//   const copyReferralLink = () => {
//     navigator.clipboard.writeText(referralLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="mt-2 text-gray-600">Loading referral data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-center">
//         <div className="text-red-600 font-semibold mb-4">{error}</div>
//         <button 
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 px-4 max-w-7xl mx-auto">
//       <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10">
//         🎉 Refer & Earn
//       </h2>

//       {/* Referral Link Section */}
//       <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 border border-gray-200">
//         <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
//           Your Unique Referral Link
//         </h3>
//         <div className="flex flex-col sm:flex-row gap-4 items-center">
//           <input
//             type="text"
//             value={referralLink}
//             readOnly
//             className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
//           />
//           <button
//             onClick={copyReferralLink}
//             className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-3 rounded-lg transition shadow-sm min-w-[150px] justify-center"
//           >
//             <ClipboardDocumentIcon className="w-5 h-5" />
//             {copied ? 'Copied!' : 'Copy Link'}
//           </button>
//         </div>
//         {copied && (
//           <p className="mt-3 text-green-600 text-sm">
//             Link copied to clipboard! Share it with friends.
//           </p>
//         )}
//       </div>

//       {/* Referral Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//         <StatCard 
//           label="Total Referrals" 
//           value={referrals.length} 
//         />
//         <StatCard 
//           label="Active Referrals" 
//           value={referrals.filter(r => r.status === 'active').length} 
//         />
//         <StatCard 
//           label="Total Earnings" 
//           value={referrals.reduce((sum, r) => sum + (r.commissionEarned || 0), 0)} 
//           isCurrency
//         />
//         <StatCard 
//           label="Available Balance" 
//           value={user?.affiliateEarnings?.available || 0} 
//           isCurrency
//         />
//       </div>

//       {/* Referral Cards */}
//       <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
//         Your Referrals
//       </h3>

//       {referrals.length === 0 ? (
//         <div className="text-center py-8 bg-white rounded-xl shadow">
//           <p className="text-gray-500 text-lg mb-2">You haven't referred anyone yet.</p>
//           <p className="text-gray-400">Share your referral link to start earning!</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {referrals.map((referral, idx) => (
//             <ReferralCard key={`${referral._id}-${idx}`} referral={referral} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // New component for referral cards
// function ReferralCard({ referral }) {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
//       <div className="flex items-start gap-3 mb-3">
//         <div className="bg-orange-100 p-2 rounded-full">
//           <ClipboardDocumentIcon className="w-6 h-6 text-orange-500" />
//         </div>
//         <div>
//           <p className="font-medium text-gray-900">
//             {referral.referredUser?.name || 'Anonymous User'}
//           </p>
//           <p className="text-sm text-gray-500">
//             {referral.referredUser?.email || 'No email'}
//           </p>
//         </div>
//       </div>
      
//       <div className="space-y-2">
//         <p className="text-gray-600">
//           <span className="font-medium">Course:</span> {referral.coursePurchased?.name || 'Not purchased yet'}
//         </p>
//         <p className="text-gray-600">
//           <span className="font-medium">Status:</span> 
//           <span className={`ml-1 ${referral.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
//             {referral.status}
//           </span>
//         </p>
//         <p className={`font-semibold ${referral.commissionEarned ? 'text-green-600' : 'text-gray-500'}`}>
//           Commission: ₹{referral.commissionEarned?.toFixed(2) || '0.00'}
//         </p>
//       </div>
//     </div>
//   );
// }

// // Stat card component
// function StatCard({ label, value, isCurrency = false }) {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
//       <div className="text-2xl font-bold text-gray-800">
//         {isCurrency ? '₹' : ''}{isCurrency ? value.toFixed(2) : value}
//       </div>
//       <div className="text-sm text-gray-500 mt-1">{label}</div>
//     </div>
//   );
// }

// export default ReferralPage;