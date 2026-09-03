import React from 'react';
import { Phone, Mail, MapPin, Star, Heart, ShoppingBag } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">About Mercy Cake Joy</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We're passionate about creating beautiful, delicious cakes that make your special moments even more memorable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Our Story</h3>
          <p className="text-gray-600 leading-relaxed">
            Founded with a love for baking and a commitment to quality, Mercy Cake Joy has been serving the community with 
            exceptional cakes for birthdays, weddings, and special events. Each cake is made with premium ingredients and 
            crafted with attention to detail.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our talented bakers combine traditional techniques with modern creativity to bring your vision to life. 
            Whether you choose from our curated catalogue or design a custom cake, we ensure every bite is perfect.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone/WhatsApp</p>
                  <p className="text-gray-600">+260 77 076 3960</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">hello@cakecatalogue.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600">Lusaka, Zambia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-semibold">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-semibold">9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-semibold">Closed</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * For urgent orders on weekends, please contact us via WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="text-pink-600" size={32} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Custom Orders</h4>
            <p className="text-gray-600">Design your perfect cake with our interactive cake designer and place custom orders.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="text-blue-600" size={32} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Special Events</h4>
            <p className="text-gray-600">Wedding cakes, birthday celebrations, corporate events, and all special occasions.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="text-green-600" size={32} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Delivery Service</h4>
            <p className="text-gray-600">Fast and reliable delivery service across Lusaka to ensure your cake arrives fresh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}