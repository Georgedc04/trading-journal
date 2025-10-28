"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaDiscord, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="min-h-screen bg-[#0B0F14] text-gray-200 px-6 sm:px-12 py-24">
      <div className="max-w-5xl mx-auto">
        {/* === Page Header === */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-300 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a question, feedback, or partnership idea? We’d love to hear
            from you. Our team will get back to you as soon as possible.
          </p>
        </motion.div>

        {/* === Grid Layout === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* === Contact Form === */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[#10151F] border border-gray-800 rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Send us a message
            </h2>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#0E141E] border border-gray-700 rounded-lg text-gray-200 focus:border-cyan-400 focus:outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#0E141E] border border-gray-700 rounded-lg text-gray-200 focus:border-cyan-400 focus:outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 bg-[#0E141E] border border-gray-700 rounded-lg text-gray-200 focus:border-cyan-400 focus:outline-none transition-all resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg transition-all"
                >
                  Send Message
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <h3 className="text-cyan-400 text-lg font-semibold mb-2">
                  Thank you!
                </h3>
                <p className="text-gray-400">
                  Your message has been successfully sent. We’ll get back to you
                  soon.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* === Contact Info === */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-100 mb-3">
                Get in Touch
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Whether you need support, have business inquiries, or just want
                to say hello — we’re always open to connecting with traders and
                innovators worldwide.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-cyan-400 text-xl" />
                <p className="text-sm">
                  <span className="text-gray-300">Email:</span>{" "}
                  <a
                    href="mailto:support@dctrades.vercel.app"
                    className="text-cyan-300 hover:underline"
                  >
                    support@dctrades.vercel.app
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaDiscord className="text-[#5865F2] text-xl" />
                <p className="text-sm">
                  <span className="text-gray-300">Join Discord:</span>{" "}
                  <a
                    href="https://discord.gg/YJnTSH8S"
                    target="_blank"
                    className="text-cyan-300 hover:underline"
                  >
                    DC Trades Community
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-cyan-400 text-xl" />
                <p className="text-sm">
                  <span className="text-gray-300">Address:</span> Graphic Era
                  Hill University, Dehradun, India
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
