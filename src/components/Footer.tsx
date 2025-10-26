import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import logo from "../assets/yuga_ai_logo.jfif";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus("loading");

    try {
      // Simulate API request (replace this with your real endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulated success
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Mission", href: "/mission" },
      { name: "Our Services", href: "/services" }, // Added this line
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "System Status", href: "/status" },
      { name: "Community", href: "/community" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms and Conditions", href: "/terms" }, // Changed from "Terms of Service"
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:text-blue-600",
    },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/company/yuga-ai/",
      color: "hover:text-blue-700",
    },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={logo}
                  alt="YUGA AI Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                YUGA AI
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Revolutionary AI-powered education platform that transforms
              learning through interactive avatars, personalized content, and
              intelligent doubt-solving capabilities.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-purple-400" />
                <span>yuga@navodhan.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-purple-400" />
                <span>+91 8089846983</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                <span>Thiruvananthapuram, Kerala</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4">
              Get the latest updates on new courses, features, and AI education
              insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                onClick={handleSubscribe}
                disabled={status === "loading"}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-60"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {status === "success" && (
              <p className="text-green-400 mt-2">Thank you for subscribing!</p>
            )}
            {status === "error" && (
              <p className="text-red-400 mt-2">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} YUGA AI. All rights reserved. Powered by advanced
              AI technology.
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              YUGA AI is committed to making quality education accessible
              through artificial intelligence. Our platform uses cutting-edge
              technology to provide personalized learning experiences.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};