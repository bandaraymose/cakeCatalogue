import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <span className="text-white font-bold">CC</span>
              </div>
              <h3 className="text-xl font-bold">Cake Catalogue</h3>
            </div>
            <p className="text-gray-400">
              Creating delicious memories, one cake at a time. Quality ingredients, creative designs, and exceptional service.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-pink-400 transition-colors">Home</a>
              <a href="#" className="block text-gray-400 hover:text-pink-400 transition-colors">Catalogue</a>
              <a href="#" className="block text-gray-400 hover:text-pink-400 transition-colors">Designer</a>
              <a href="#" className="block text-gray-400 hover:text-pink-400 transition-colors">About</a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-400">
              <p>+260 97 123 4567</p>
              <p>hello@cakecatalogue.com</p>
              <p>Lusaka, Zambia</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Facebook size={20} />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Stay updated with our latest creations and special offers!
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cake Catalogue. All rights reserved. Made with ❤️ in Lusaka.</p>
        </div>
      </div>
    </footer>
  );
}