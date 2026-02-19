"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface ContactFormProps {
  theme?: "space" | "classic" | "runic" | "gamer";
}

export const ContactForm: React.FC<ContactFormProps> = ({ theme = "space" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "classic":
        return {
          container: "classic-card",
          input: "border-gray-300 focus:border-blue-500",
          button: "classic-button text-white",
          text: "classic-text"
        };
      case "runic":
        return {
          container: "runic-card rune-glow",
          input: "border-amber-500 bg-stone-800 text-amber-200 focus:border-amber-300",
          button: "runic-button text-black",
          text: "runic-text"
        };
      case "gamer":
        return {
          container: "gamer-card rgb-border",
          input: "border-cyan-400 bg-black text-cyan-400 focus:border-pink-500",
          button: "gamer-button text-black",
          text: "gamer-text"
        };
      default:
        return {
          container: "bg-[#0c0c0c] border border-[#7042f861]",
          input: "border-purple-500 bg-gray-900 text-white focus:border-purple-300",
          button: "button-primary text-white",
          text: "text-gray-300"
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      onSubmit={handleSubmit}
      className={`max-w-2xl mx-auto p-8 rounded-lg ${themeClasses.container}`}
    >
      <h3 className={`text-2xl font-bold mb-6 text-center ${themeClasses.text}`}>
        Contact Me
      </h3>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-lg ${themeClasses.input} transition-colors`}
        />
      </div>

      <div className="mb-4">
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-lg ${themeClasses.input} transition-colors`}
        />
      </div>

      <div className="mb-6">
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-lg ${themeClasses.input} transition-colors resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-bold ${themeClasses.button} disabled:opacity-50 transition-all`}
      >
        {isLoading ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="mt-4 text-green-500 text-center">Message sent successfully!</p>
      )}

      {status === "error" && (
        <p className="mt-4 text-red-500 text-center">Failed to send message. Please try again.</p>
      )}
    </motion.form>
  );
};