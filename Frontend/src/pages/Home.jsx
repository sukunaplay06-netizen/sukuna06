import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const chatData = [
  { name: "Rohan Mehra", message: "Hey, I have a quick project need a visiting card design by this weekend" },
  { name: "Priya Singh", message: "Can you send me the latest mockups?" },
  { name: "Ankit Verma", message: "I need the website draft by tomorrow" },
  { name: "Simran Kaur", message: "Let's finalize the logo today" },
  { name: "Amit Sharma", message: "Can you check the payment details?" },
];

function Home() {
  const [chatIndex, setChatIndex] = useState(0);

  // ✅ Hooks MUST be inside component
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Referral + Mobile Back FIX
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (ref) {
      // Ref code save kar do (har baar latest wala)
      localStorage.setItem("referralCode", ref);

      // URL clean kar do (?ref= hata do)
      window.history.replaceState({}, document.title, "/");

      // Signup pe redirect karo (history mein entry add hogi → back se home pe aayega)
      navigate(`/auth/signup?ref=${ref}`);
      // Agar chahta hai URL mein ?ref= na dikhe to ye line use kar:
      // navigate("/auth/signup");
    }
  }, [location.search, navigate]);

  // Chat animation
  useEffect(() => {
    const interval = setInterval(() => {
      setChatIndex((prev) => (prev + 1) % chatData.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const currentChat = chatData[chatIndex];
  return (
    <section className="bg-white py-8 px-4 sm:py-16 sm:px-8 md:px-16 relative overflow-visible">
      {/* Optional background pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0 bg-repeat bg-[length:100px_100px]"></div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto z-10">
        {/* Left Side: Text and CTA */}
        <div className="z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Build Your Skills
            <br />
            <span className="relative inline-block mt-2">
              Grow With{' '}
              <span className="relative inline-block font-extrabold text-gray-900">
                <span className="relative z-10">Leadsgurukul</span>
                <span className="absolute left-0 bottom-0 w-full h-1 bg-orange-500 transform -skew-x-12 z-0"></span>
              </span>
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg sm:text-xl max-w-md">
            Join India’s learners who’ve transformed their skills into income through expert-guided training.
          </p>

          <Link to="/auth/signup">
            <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold text-base sm:text-lg flex items-center gap-2 transition-all duration-300">
              Start Learning Today <span className="text-xl">↗</span>
            </button>
          </Link>

        </div>

        {/* Right Side: Image and Feedback */}
        {/* <div className="relative w-full min-h-[300px] sm:min-h-[400px] z-10 flex justify-center items-center"> */}
        {/* Right Side: Image and Feedback */}
        {/* <div className="hidden md:block relative w-full min-h-[300px] sm:min-h-[400px] z-10 flex justify-center items-center"> */}

        {/* Right Side: Image and Feedback */}
        <div className="hidden md:block relative w-full min-h-[300px] sm:min-h-[400px] z-10 flex justify-center items-center">

          {/* Wrapper to control image and floating cards */}
          <div className="relative w-full max-w-[420px] sm:max-w-[460px] md:max-w-[500px] group">


            <img
              src="/Girl-1.jpg"
              alt="Freelancer"
              className="w-full h-auto max-h-[550px] object-contain rounded-xl shadow-xl mx-auto"
            />

            {/* Rotating Chat Bubble */}

            <div
              className="
    absolute 
    bottom-[-30px] sm:bottom-8 
    left-1/2 sm:left-6 
    -translate-x-1/2 sm:translate-x-0
    bg-white p-4 rounded-xl shadow-lg w-64 
    flex gap-3 items-start 
    z-20 transition-all duration-500
  "
            >
              <div className="text-orange-500 text-2xl">💬</div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{currentChat.name}</p>
                <p className="text-xs text-gray-600">{currentChat.message}</p>
              </div>
            </div>


          </div>

        </div>
      </div>
    </section >
  );
}

export default Home;