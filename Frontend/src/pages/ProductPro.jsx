// frontend/src/pages/ProductPro.jsx
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import api from "../api/axios";

function ProductPro() {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get("/courses");
        // Assuming "Marketing Mastery" is the first course or filter by slug/name
        const selectedCourse =
          res.data.find((c) => c.slug === "pro") || res.data[0];
        setCourse(selectedCourse);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-100 py-16 border-b">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 px-6">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              {course ? course.name : "Loading..."}
            </h1>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl">
              Learn the core concepts & strategies of affiliate marketing, from niche and product selection to working like a professional. Get hands-on training with top platforms like ClickBank, and WarriorPlus.Master advanced sales strategies including pitching affiliate offers, handling objections, and closing deals with confidence using professional sales scripts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {/* <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg hover:from-orange-600 hover:to-pink-600 transition">
                Enroll Now
              </button> */}
              <Link
                to="/courses"
                className="px-8 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                ← Back to Courses
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src={course?.thumbnail || "/images/anmol-duggal.png"}
                alt={course?.name || "Trainer"}
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 text-center">
          {[
            { icon: "/coursesImg/course_icon.png", label: "30 Course" },
            { icon: "/coursesImg/hours_icon.png", label: "150+ Hours" },
            { icon: "/coursesImg/students_icon.png", label: "15K+ Students" },
            { icon: "/coursesImg/certificate_icon.png", label: "Certificate" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[140px] text-gray-700"
            >
              <img src={stat.icon} alt={stat.label} className="w-12 h-12 mb-2" />
              <p className="font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>


      {/* What You Will Learn */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              What You Will Learn
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[

              {
                title: "Marketing Training",
                points: [
                  "Affiliate Marketing – Concept & Strategy",
                  "Niche & Product Selection",
                  "How to work Like a Pro",
                  "Different Platforms – ClickBank, JVZoo, WarriorPlus",
                  "Finding Killer Products",
                  "Marketing & Promotions",

                ],
              },
              {
                title: "Sales Training",
                points: [
                  "Advance Sales Strategy",
                  "How to Pitch Affiliate Offers",
                  "Objection Handling",
                  "Sales Closing Strategies",
                  "Professional Sales Scripts",
                  "Advanced Strategy of Leads Generation",
                ],
              },
              {
                title: "CPA Marketing",
                points: [
                  "Basics of CPA Marketing",
                  "CPA Offers from IMC Platform",
                  "Finding Ad Copies",
                  "Keyword Research",
                  "Bing Ads Creation & Optimization",
                  "DFY Landing Page / Funnel",

                ],
              },
              {
                title: "Personal Branding",
                points: [
                  "How to Build Your Personal Brand Presence",
                  "How to Niche Clarity & Brand Story",
                  "How to Brand Positioning & Kit",
                  "How to Content Strategy",
                  "How to Copywriting Basics",
                  "Content Creation for Personal Branding",


                ],
              },
              {
                title: "Personal Branding",
                points: [
                  "Build Your Personal Brand Presence",
                  "Niche Clarity & Brand Story",
                  "Brand Positioning & Kit",
                  "Content Strategy",
                  "Bing Ads Coupons for Campaigns",
                  "How to get Bing Ads Coupons for Initial Campaigning",
                  "Bing Ads Coupons for Campaigns",
                  "How to get Bing Ads Coupons for Initial Campaigning",
                ],
              },
            ].map((section, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-8 shadow hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.points.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start text-gray-700 leading-relaxed"
                    >
                      <span className="text-blue-600 mr-3 mt-1">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
            Who Is This Course For?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Students who want to build a digital career",
              "Working professionals aiming for side-income",
              "Entrepreneurs scaling their business with digital marketing",
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition"
              >
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <Footer />
    </>
  );
}

export default ProductPro
