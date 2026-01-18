// src/pages/Information.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Information = () => {
  const sections = [
    {
      title: "Structured Curriculum",
      desc: "Our program follows a well-organized and easy-to-understand curriculum designed for complete beginners as well as growing digital creators. Every module is structured step-by-step so you can learn smoothly, apply practically, and build real earning potential.",
    },
    {
      title: "Personalized Mentorship",
      desc: "Our program offers one-on-one personalized mentorship to guide you at every step of your digital journey. Whether you’re learning a new skill, building your online presence, or growing your affiliate income, our mentors provide individual support based on your goals and progress.",
    },
    {
      title: "Mock Tests & Evaluation",
      desc: "Our program includes regular mock tests and performance evaluations to help you measure your progress and strengthen your learning. These tests are designed to give you real-world practice, boost your confidence, and ensure you truly understand every concept before moving forward.",
    },
    {
      title: "Study Materials & Resources",
      desc: "Our program provides high-quality study materials and resources designed to simplify learning and boost your real-world results. Every learner gets access to easy-to-understand notes, practical guides, templates, and tools that make the entire journey smoother and more effective.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-yellow-50 py-12 px-6 flex flex-col items-center">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          About Our Program
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Our program is designed to help beginners, students, and aspiring digital entrepreneurs build real online skills and earn confidently through affiliate marketing. We combine high-value training with a powerful earning system so you can learn and grow at the same time.
        </p>
      </motion.div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full mb-16">
        {sections.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-[0_0_25px_rgba(250,204,21,0.3)] transition transform hover:-translate-y-2"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{s.title}</h3>
            <p className="text-gray-600 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Highlight Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-3xl shadow-xl p-10 max-w-5xl text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          A Complete Ecosystem</h2>
        <p className="text-lg md:text-xl">
          From strategy to execution, mentorship to evaluation — we provide
          everything an aspirant needs under one program.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Want to Know More?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Join our program today and get access to free orientation sessions.
        </p>
        <Link to="/auth/signup" className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-xl text-lg font-semibold shadow-lg transition transform hover:scale-105">
          Get More Info 📘
        </Link>
      </motion.div>
    </div>
  );
};

export default Information;
