import React, { useState } from 'react';
//import Logo from "../assets/images/logo.jpg"; 
import { Instagram, Facebook, Menu, X } from 'lucide-react';



export default function Navbar({ currentPage, setCurrentPage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'catalogue', label: 'Catalogue' },
    { id: 'designer', label: 'Designer' },
    { id: 'about', label: 'About' }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
              <img src="src/public/logo.jpg" alt="Cake Catalogue Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mercy Cake Joy</h1>
              <p className="text-xs text-gray-500">Sweet Celebrations</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`transition-colors duration-200 ${
                  currentPage === item.id 
                    ? 'text-pink-600 font-semibold' 
                    : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social Links & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-pink-500 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <nav className="flex flex-col space-y-2 pt-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-gray-700 hover:text-pink-500 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}