import React from "react";
import Footer from "../components/Footer"; // Adjust the path based on your folder structure

function FAQ() {
  const faqs = [
    {
      question: "How do I join the affiliate program?",
      answer:
        "Simply sign up using our registration form. Once approved, you’ll get your unique referral link to start promoting."
    },
    {
      question: "How much commission can I earn?",
      answer:
        "You’ll earn 60% commission on each qualifying sale made through your referral link."
    },
    {
      question: "When do I get paid?",
      answer:
        "We process affiliate payments monthly, after the refund period ends. Minimum payout threshold applies."
    },
    {
      question: "How long does the referral cookie last?",
      answer:
        "Our affiliate tracking cookie lasts 30 days, so you get credit if someone purchases within that period."
    },
    {
      question: "Where can I get marketing materials?",
      answer:
        "We provide banners, email templates, and social media content in your affiliate dashboard."
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">
          Frequently Asked Questions (FAQ)
        </h1>
        <div className="bg-white rounded-2xl shadow-lg p-8 leading-relaxed space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <h2 className="text-xl font-semibold text-purple-600 mb-2">
                {faq.question}
              </h2>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

export default FAQ;