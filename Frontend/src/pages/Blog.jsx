import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "Affiliate Marketing 101: A Beginner's Guide",
    date: "September 21, 2025",
    excerpt:
      "A step-by-step introduction to affiliate marketing: how it works, why it's growing, and how to start building your own income streams without upfront costs.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Top 10 Mistakes New Affiliates Make (and How to Avoid Them)",
    date: "September 22, 2025",
    excerpt:
      "From picking the wrong niche to spamming social media, we cover the mistakes that sink new affiliates and how you can sidestep them to grow faster.",
    image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "How to Choose the Right Affiliate Program for Your Niche",
    date: "September 24, 2025",
    excerpt:
      "Not all programs are created equal. Learn how to evaluate commission rates, EPCs, cookie durations and brand reputation to maximize your earnings.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    title: "Content Strategies to Boost Affiliate Conversions",
    date: "September 25, 2025",
    excerpt:
      "Content is king. Discover high-performing blog types, comparison posts, reviews, lead magnets and funnel strategies to increase conversions.",
    image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    title: "The Future of Affiliate Marketing: 2025 & Beyond",
    date: "September 26, 2025",
    excerpt:
      "AI, voice search, influencer marketing and micro-niches are reshaping affiliate marketing. Stay ahead of trends and prepare your business for the next wave.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    title: "Social Media Tactics to Maximize Affiliate Income",
    date: "September 27, 2025",
    excerpt:
      "Instagram, TikTok and YouTube are goldmines for affiliates. Learn how to use reels, shorts and trending content to drive traffic and boost sales.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 7,
    title: "Email Marketing Secrets for Affiliate Success",
    date: "September 29, 2025",
    excerpt:
      "Build an email list that converts. Discover autoresponder sequences, segmentation strategies, and compliance tips to maximize ROI.",
    image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 8,
    title: "Best Affiliate Tools to Skyrocket Your Productivity",
    date: "September 30, 2025",
    excerpt:
      "Tracking software, link cloakers, landing page builders and keyword research tools – here's a curated list of must-have tools for affiliates.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 9,
    title: "High Ticket Affiliate Marketing: Earn Bigger Commissions",
    date: "October 1, 2025",
    excerpt:
      "How to move from low-ticket products to high-ticket offers. We break down funnel structure, traffic strategy and closing techniques for big payouts.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 10,
    title: "Building Trust and Authority as an Affiliate Marketer",
    date: "October 2, 2025",
    excerpt:
      "People buy from those they trust. Learn brand building, credibility, ethical promotion and disclosure practices that increase conversions.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 11,
    title: "Affiliate SEO: Rank Your Content and Drive Free Traffic",
    date: "October 3, 2025",
    excerpt:
      "Step-by-step guide to on-page SEO, link building, keyword clustering and topical authority so your posts rank and bring in organic traffic for years.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 12,
    title: "Scaling Your Affiliate Business to $10K/Month and Beyond",
    date: "October 4, 2025",
    excerpt:
      "Outsourcing, automation, paid ads, and advanced analytics to scale from side hustle to full-time income. Strategies top affiliates use to grow fast.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
];

function Blog() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-purple-700 mb-10 text-center">
          Affiliate Marketing Blog
        </h1>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <p className="text-xs text-gray-500">{post.date}</p>
                <h2 className="text-xl font-semibold mt-2 mb-3 text-gray-800 group-hover:text-purple-700">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                {/* <Link
                  to={`/blog/${post.id}`}
                  className="inline-block text-purple-700 hover:text-yellow-500 font-medium transition-colors duration-300"
                >
                //Rohan Gejage jnnmewf selg
                  Read More →
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;