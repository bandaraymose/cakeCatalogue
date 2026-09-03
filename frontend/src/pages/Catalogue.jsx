import React, { useState, useEffect } from 'react';
import { getCakes, toImageUrl } from '../api/client';

// Simple CakeCard component
function CakeCard({ cake }) {
  const [selectedSize, setSelectedSize] = useState('');

  const sizePrices = Array.isArray(cake.sizePrices) ? cake.sizePrices : [];
  const hasSizePrices = sizePrices && sizePrices.length > 0;
  const sizesList = hasSizePrices ? sizePrices.map(sp => sp.size) : (Array.isArray(cake.sizes) ? cake.sizes : []);

  const selectedPrice = hasSizePrices
    ? (sizePrices.find(sp => sp.size === selectedSize)?.price ?? Math.min(...sizePrices.map(sp => sp.price)))
    : undefined;

  useEffect(() => {
    if (!selectedSize && sizesList.length > 0) {
      setSelectedSize(sizesList[0]);
    }
  }, [sizesList]);

  const handleOrder = () => {
    const phone = '260770763960';
    const priceText = `K${selectedPrice}`;
    const sizeText = selectedSize ? ` (Size: ${selectedSize})` : '';
    const message = `Hi! I'm interested in ordering "${cake.name}"${sizeText} - ${cake.description}. Price: ${priceText}`;
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2">
      <img
        src={toImageUrl(cake.imageUrl || cake.image)}
        alt={cake.name}
        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
      />
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900">{cake.name}</h3>
          {hasSizePrices && (
            <span className="text-2xl font-bold text-pink-600">K{selectedPrice}</span>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed">
          {cake.description}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(cake.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {cake.rating} ({cake.reviews} reviews)
          </span>
        </div>

        {sizesList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizesList.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-full text-sm border ${selectedSize === size ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
              >
                {hasSizePrices
                  ? `${size} - K${(sizePrices.find(sp => sp.size === size)?.price) ?? ''}`
                  : size}
              </button>
            ))}
          </div>
        )}
        {Array.isArray(cake.flavors) && cake.flavors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cake.flavors.map((flavor) => (
              <span key={flavor} className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">
                {flavor}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleOrder}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Order Now via WhatsApp
        </button>
      </div>
    </div>
  );
}

export default function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getCakes()
      .then((data) => {
        if (!mounted) return;
        setCakes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load cakes');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredCakes = cakes
    .filter(cake => cake.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') {
        const amin = Array.isArray(a.sizePrices) && a.sizePrices.length > 0 ? Math.min(...a.sizePrices.map(sp => sp.price)) : Number.MAX_SAFE_INTEGER;
        const bmin = Array.isArray(b.sizePrices) && b.sizePrices.length > 0 ? Math.min(...b.sizePrices.map(sp => sp.price)) : Number.MAX_SAFE_INTEGER;
        return amin - bmin;
      }
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="space-y-8">
      {loading && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">Loading cakes...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Cake Catalogue</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our collection of handcrafted cakes, perfect for birthdays, weddings, and special occasions.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cake Grid with extra spacing for hover effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
        {filteredCakes.map(cake => (
          <CakeCard key={cake.id} cake={cake} />
        ))}
      </div>

      {filteredCakes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No cakes found matching your search.</p>
        </div>
      )}
    </div>
  );
}