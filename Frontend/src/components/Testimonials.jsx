import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = [
          {
            name: "Rajat Arora",
            rating: 5,
            feedback:
              "Honestly, I was never into online courses. But one of the best decisions I took was to join leadsgurukul. The course was practical, fun, and easy to go through. The best part was the community and mentors.",
            image: "/girl-8.jpeg",
          },
          {
            name: "Monika Rawat",
            rating: 5,
            feedback:
              "After completing the bundle, I applied the techniques to reach out to international clients. Today, I’m earning $2,000+ per month through freelancing. Thanks to leadsgurukul for the step-by-step guidance.",
            image: "/girl-2.jpeg",
          },
          {
            name: "Ravi Mehta",
            rating: 5,
            feedback:
              "I used to overthink everything—this course helped me start taking action. The simple, step-by-step guidance made it easy to apply and see results. I’m so glad I joined!",
            image: "/boy-1.jpeg",
          },
          {
            name: "Kajal Sehgal",
            rating: 5,
            feedback:
              "I thought being a freelancer was risky, but this course made it easy. The practical skills, the mentors, and the community gave me the confidence to start my freelancing journey. I never thought I’d be making money this way!",
            image: "/girl-4.jpeg",
          },
          {
            name: "Vivek Singh",
            rating: 5,
            feedback:
              "Before this, I wasn’t earning anything consistently. After applying what I learned, I now have close to $1,500+ monthly from freelancing. leadsgurukul changed my perspective and gave me the skills I needed!",
            image: "/boy-2.jpeg",
          },
          {
            name: "Kritika Arora",
            rating: 5,
            feedback:
              "The course was amazing—the practical tips blew my mind! I started applying what I learned, and within a month, I landed my first client. I can’t thank leadsgurukul enough for this transformation.",
            image: "/girl-5.jpeg",
          },
        ];
        setTestimonials(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load testimonials');
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="bg-slate-50 py-16 text-center">Loading testimonials...</div>;
  }

  if (error) {
    return <div className="bg-slate-50 py-16 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
          What Our Freelancers Say
        </h2>

        <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
          Real stories. Real results. From freelancers who turned learning into income.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-orange-400 
                     hover:shadow-2xl hover:border-pink-500 transform hover:-translate-y-2 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={`Profile picture of ${testimonial.name}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 mr-4 
                         group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => (e.target.src = '/image/default-user.png')}
                />

                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {testimonial.name}
                  </h3>

                  <div className="text-amber-400 text-base">
                    {"★".repeat(testimonial.rating)}
                  </div>
                </div>
              </div>

              {/* 🚫 italic removed here */}
              <p className="text-slate-600 text-sm mb-4 leading-relaxed group-hover:text-slate-800 group-hover:scale-[1.02] transition-all duration-300">
                "{testimonial.feedback}"
              </p>

              <button className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg shadow-sm 
                             border border-gray-200 hover:bg-orange-50 hover:border-orange-400 transition-colors">
                <img
                  src="/meta.jpg"
                  alt="Verified"
                  className="w-5 h-5 object-cover rounded-full"
                />
                <span className="text-gray-900 font-medium group-hover:text-orange-600 transition-colors">
                  Verified
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  );
}

export default Testimonials;
