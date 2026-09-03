import React, { useState } from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';

export default function CakeCard({ cake }) {
  const [isLiked, setIsLiked] = useState(false);
  const phone = '260971234567'; // Replace with actual phone number
  const message = `Hello! I'd like to order: ${cake.name} - Size: ${cake.sizes?.[0] || 'Standard'} - Flavor: ${cake.flavors?.[0] || 'Default'} - Price: ${cake.price}`;
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      <div className="relative overflow-hidden">
        <img 
          src={cake.image} 
          alt={cake.name} 
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg transition-colors"
        >
          <Heart 
            size={20} 
            className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`} 
          />
        </button>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{cake.rating}</span>
            <span className="text-xs text-gray-500">({cake.reviews})</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{cake.name}</h3>
          <span className="text-2xl font-bold text-pink-600">{cake.price}</span>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">{cake.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {cake.sizes.map(size => (
            <span key={size} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {size}
            </span>
          ))}
        </div>
        
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold text-center hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <ShoppingBag size={18} />
          <span>Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}