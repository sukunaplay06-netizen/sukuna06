import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function AboutUs() {
  const teamMembers = [
    {
      name: "Tejas Nikam",
      role: "Founder & CEO",
      bio: "Passionate about empowering freelancers with the skills to succeed.",
      image: "/boy-10.jpeg",
    },
    {
      name: "Arti Gore",
      role: "Head of Education",
      bio: "Dedicated to creating impactful learning experiences for all.",
      image: "/girl-8.jpeg",
    },
    {
      name: "Swati Pepeti",
      role: "Lead Mentor",
      bio: "Helping students achieve their freelancing goals with practical guidance.",
      image: "/girl-7.jpeg",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
            About Leadsgurukul
          </h2>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-orange-100 leading-relaxed">
           Join India’s learners who’ve transformed their skills into income through expert-guided training.
          </p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-16 text-gray-800">
        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="text-3xl font-bold text-orange-600 mb-4 border-b-4 border-orange-200 pb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To empower individuals with the knowledge, skills, and community support they need to thrive as digital freelancers, creating opportunities for financial independence and personal growth.
            </p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h3 className="text-3xl font-bold text-orange-600 mb-4 border-b-4 border-orange-200 pb-3">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To build a global community of freelancers who are confident, skilled, and successful, revolutionizing the way people work and live through digital entrepreneurship.
            </p>
          </div>
        </section>

        {/* Meet the Team */}
        <section>
          <h3 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
            Meet Our Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-4 border-orange-400 shadow-md"
                />
                <h4 className="text-xl font-bold text-gray-800">{member.name}</h4>
                <p className="text-orange-600 font-medium text-sm uppercase tracking-wide">
                  {member.role}
                </p>
                <p className="text-gray-600 mt-3 text-base leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default AboutUs;
