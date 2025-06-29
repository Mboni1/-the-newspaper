// src/components/Footer.jsx
import React from "react";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" dark:bg-blue-900 text-white dark:text-gray-300 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-yellow-600">The Halftime</h2>
          <p className="text-sm">
            Your trusted source for football, basketball, results, and talent scouting updates.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-yellow-600">Ibyo Wareba</h2>
          <ul className="space-y-2">
            <li><a href="/football" className="hover:text-yellow-200">Football</a></li>
            <li><a href="/basketball" className="hover:text-yellow-200">Basketball</a></li>
            <li><a href="/talents" className="hover:text-yellow-200">Talents</a></li>
            <li><a href="/contact" className="hover:text-yellow-200">Contact Us</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-yellow-600">Subscribe</h2>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded bg-white text-black dark:bg-gray-100 dark:text-black"
            />
            <button
              type="submit"
              className="bg-white text-blue-700 font-semibold py-2 rounded hover:bg-yellow-100 dark:bg-gray-200"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-yellow-600">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook className="hover:text-yellow-300" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <Twitter className="hover:text-yellow-300" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram className="hover:text-yellow-300" />
            </a>
            <a href="mailto:info@halftime.com" aria-label="Email">
              <Mail className="hover:text-yellow-300" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t dark:border-yellow-600 my-4"></div>

{/* Footer Bottom with Distinct Background and Left-Right Layout */}
<div className=" text-white dark:text-gray-300 mt-8 pt-4 pb-4">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm gap-2">
    {/* Left Side */}
    <div>
      © {new Date().getFullYear()} The Halftime. All rights reserved.
    </div>

    {/* Right Side Links */}
    <div className="flex space-x-4">
      <a href="/About" className="hover:text-yellow-200">About</a>
      <a href="/privacy-policy" className="hover:text-yellow-200">Privacy Policy</a>
      <a href="/terms" className="hover:text-yellow-200">Terms of Use</a>
      <a href="/cookies" className="hover:text-yellow-200">Cookies</a>
    </div>
  </div>
</div>


    </footer>
  );
}
