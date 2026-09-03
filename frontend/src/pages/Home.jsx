import React from 'react';
import { Star, Phone, Heart } from 'lucide-react';

// Mock cake images for featured section
const mockImages = {
  cake1: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  cake2: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
  cake3: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop',
  cake4: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'
};

const featuredCakes = [
  { id: 1, name: 'Chocolate Delight', price: 'K250', image: mockImages.cake1 },
  { id: 2, name: 'Vanilla Dream', price: 'K200', image: mockImages.cake2 },
  { id: 3, name: 'Red Velvet Elegance', price: 'K300', image: mockImages.cake3 },
  { id: 4, name: 'Strawberry Bliss', price: 'K280', image: mockImages.cake4 }
];

export default function Home({ setCurrentPage }) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 lg:p-16">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Delicious cakes for every
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600"> celebration</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Browse our exquisite catalogue, design your dream cake with our interactive designer, and order instantly via WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCurrentPage('catalogue')}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-semibold text-center hover:from-pink-700 hover:to-rose-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View Catalogue
              </button>
              <button 
                onClick={() => setCurrentPage('designer')}
                className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-xl font-semibold text-center hover:bg-pink-600 hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                Design a Cake
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Cakes</h3>
              <div className="grid grid-cols-2 gap-4">
                {featuredCakes.map(cake => (
                  <div key={cake.id} className="relative overflow-hidden rounded-xl group cursor-pointer">
                    <img 
                      src={cake.image} 
                      alt={cake.name}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end">
                      <div className="p-3 text-white">
                        <div className="text-sm font-semibold">{cake.name}</div>
                        <div className="text-xs opacity-80">{cake.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Follow us for more</h4>
              <p className="text-gray-600 mb-4">Stay updated with our latest creations and offers.</p>
              <div className="flex gap-3">
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl text-center font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
                  Instagram
                </a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl text-center font-semibold hover:bg-blue-700 transition-all transform hover:scale-105">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="text-center space-y-12">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Cakes?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">We're committed to creating the perfect cake for your special moments.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-pink-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
            <p className="text-gray-600">We use only the finest ingredients to create cakes that taste as amazing as they look.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Ordering</h3>
            <p className="text-gray-600">Order directly via WhatsApp for quick and convenient service.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Made with Love</h3>
            <p className="text-gray-600">Every cake is crafted with care and attention to make your celebration special.</p>
          </div>
        </div>
      </section>
    </div>
  );
}