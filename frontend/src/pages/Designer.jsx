import React from 'react';
import CakeDesigner3D from '../components/CakeDesigner';

export default function Designer() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">3D Cake Designer</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create your perfect custom cake with our interactive 3D designer. Drag to rotate, scroll to zoom!
        </p>
      </div>
      
      <CakeDesigner3D />
    </div>
  );
}