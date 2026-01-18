import React from 'react'

function AllCourses() {
  return (
    <div>AllCourses</div>
  )
}

export default AllCourses


// function AllCourses() {
//   const allCourses = {Frontend
//     "Digital Freelancing Bundles": [
//       "Freelancing Road to 50K Per Month",
//       "Freelancing Road to 2 Lakhs Per Month",
//       "Freelancing Road to 5 Lakhs Per Month",
//     ],
//     "Digital Entrepreneurship Bundle": [
//       "Marketing Mastery",
//       "Branding Mastery",
//       "Traffic Mastery",
//       "Influence Mastery",
//       "Finance Mastery",
//       "Business Mastery",
//     ],
//     "Upskilling Courses": [
//       "Development",
//       "Business",
//       "Finance",
//       "Personal Development",
//       "Design",
//       "Office Productivity",
//       "Marketing",
//       "Lifestyle",
//       "Health and Fitness",
//       "Music",
//       "Photography and Video",
//     ],
//   };

//   return (
//     <div className="max-w-7xl mx-auto my-16 px-4 md:px-10">
//       <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">All Courses</h2>
//       <div className="space-y-10">
//         {Object.keys(allCourses).map((category, index) => (
//           <div
//             key={index}
//             className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
//           >
//             <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-orange-500 pb-3 mb-5">
//               {category}
//             </h3>
//             <ul className="list-none p-0 space-y-3">
//               {allCourses[category].map((course, idx) => (
//                 <li key={idx}>
//                   <a
//                     href={`/courses/${course.toLowerCase().replace(/\s+/g, '-')}`}
//                     className="text-gray-600 text-base font-medium hover:text-orange-500 transition-colors duration-200"
//                   >
//                     {course}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AllCourses;