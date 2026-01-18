// src/pages/WhatYouWillLearn.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const WhatYouWillLearn = () => {
  const points = [
    "Keep oneself up to date with the most recent market trends because of the fierce rivalry.",
    "Join us today and unlock exciting opportunities to earn commissions while advancing your professional journey.",
    "How to optimize your Facebook & Other Social Media profile to hugely increase your visibility and generate LEADS.",
    "How to convert your Facebook profile into Lead Generation Machine to get consistent Leads every day, every week and every month.",
    "How to publish compelling contents to get you the results you want.",
    "How to Find, Connect and Engage with right Target Audience.",
    "How to generate high engaging leads using Instagram.",
    "How to generate highly qualified leads using LinkedIn.",
    "How to use FREE Lead Magnet Strategy to build your own list.",
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-yellow-50 py-20 px-6 flex flex-col items-center">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold mb-16 text-center leading-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-sm"
      >
        What You Will Learn
      </motion.h1>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl w-full items-center">
        {/* Left Image */}
        {/* <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        > */}
          {/* <motion.img
            src="beautiful.jpg"
            alt="Learning"
            className="rounded-3xl shadow-2xl border-4 border-yellow-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition duration-500"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </motion.div> */}

          <motion.img
            src="beautiful.jpg"
            alt="Learning"
            className="
    rounded-3xl 
    shadow-2xl 
    border-4 border-yellow-400 
    hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] 
    hover:scale-105 
    transition 
    duration-500
    w-full 
    max-w-[280px]   /* mobile */
    sm:max-w-[350px]  /* tablet */
    md:max-w-[450px]  /* desktop */
    lg:max-w-[550px]  /* large desktop */
    h-auto 
    mx-auto
  "
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />


          {/* Right Points */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-center"
          >
            <ul className="space-y-6 text-gray-800 text-lg">
              {points.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className="flex items-start gap-4 bg-gradient-to-r from-white to-yellow-50 shadow-md rounded-2xl p-5 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] transition"
                >
                  <CheckCircle className="text-yellow-500 w-7 h-7 flex-shrink-0 mt-1" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
      </div>
    </div>
  );
};

export default WhatYouWillLearn;
