import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Custom Heart Geometry using ExtrudeGeometry instead of LatheGeometry
function createHeartGeometry(scale = 1, depth = 0.4) {
  const heartShape = new THREE.Shape();
  const x = 0, y = 0;
  
  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
  
  const extrudeSettings = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  };
  
  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  geometry.scale(scale * 0.08, scale * 0.08, 1);
  geometry.center();
  // Rotate the heart to lay flat like other cake shapes
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

// 3D Cake Component
function Cake3D({ shape, flavor, color, toppings, layers }) {
  const groupRef = useRef();
  
  // Rotate cake slowly for better visualization
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Convert color names to Three.js colors
  const getColor = (colorName) => {
    const colors = {
      'White': '#ffffff',
      'Pink': '#ffb6c1',
      'Blue': '#87ceeb', 
      'Brown': '#8b4513'
    };
    return colors[colorName] || colors['White'];
  };

  // Get cake geometry based on shape with scaling for layer size
  const getCakeGeometry = (layerIndex, totalLayers) => {
    // Calculate scale: bottom layer (index 0) is full size, top layer gets smaller
    const scale = Math.pow(0.85, layerIndex);
    
    switch (shape) {
      case 'Round':
        return <cylinderGeometry args={[1 * scale, 1 * scale, 0.4, 32]} />;
      case 'Square':
        return <boxGeometry args={[1.8 * scale, 0.4, 1.8 * scale]} />;
      case 'Heart':
        const heartGeo = createHeartGeometry(scale, 0.4);
        return <primitive object={heartGeo} />;
      default:
        return <cylinderGeometry args={[1 * scale, 1 * scale, 0.4, 32]} />;
    }
  };

  // Get icing geometry with scaling
  const getIcingGeometry = (layerIndex, totalLayers) => {
    const scale = Math.pow(0.85, layerIndex);
    const icingScale = scale * 1.05; // Slightly larger than cake
    
    switch (shape) {
      case 'Round':
        return <cylinderGeometry args={[icingScale, icingScale, 0.05, 32]} />;
      case 'Square':
        return <boxGeometry args={[1.8 * icingScale, 0.05, 1.8 * icingScale]} />;
      case 'Heart':
        const heartGeo = createHeartGeometry(icingScale, 0.05);
        return <primitive object={heartGeo} />;
      default:
        return <cylinderGeometry args={[icingScale, icingScale, 0.05, 32]} />;
    }
  };

  // Layer colors for multi-layer cakes
  const getLayerColor = (layerIndex, totalLayers) => {
    if (totalLayers === 1) return getColor(color);
    
    const colors = {
      'Vanilla': '#f8f5e4',
      'Chocolate': '#8B4513', 
      'Red Velvet': '#dc2626',
      'Lemon': '#fef08a'
    };
    
    // Alternate between selected color and flavor-based colors
    return layerIndex % 2 === 0 ? getColor(color) : colors[flavor] || getColor(color);
  };

  // Toppings components
  const Toppings = ({ baseHeight, layerIndex, totalLayers }) => {
    const elements = [];
    const topY = baseHeight + 0.2;
    const scale = Math.pow(0.85, layerIndex);
    
    if (toppings.includes('Sprinkles')) {
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.7 * scale;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        elements.push(
          <mesh key={`sprinkle-${i}`} position={[x, topY + 0.02, z]} rotation={[0, 0, Math.random() * Math.PI]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)} />
          </mesh>
        );
      }
    }

    if (toppings.includes('Fruit')) {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.6 * scale;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        elements.push(
          <mesh key={`fruit-${i}`} position={[x, topY + 0.04, z]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ff4444' : '#ffaa00'} />
          </mesh>
        );
      }
    }

    if (toppings.includes('Chocolate Shavings')) {
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.8 * scale;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        elements.push(
          <mesh key={`choc-${i}`} position={[x, topY + 0.01, z]} rotation={[Math.random() * 0.5, 0, Math.random() * Math.PI]}>
            <boxGeometry args={[0.15, 0.02, 0.05]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        );
      }
    }

    if (toppings.includes('Edible Flowers')) {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 0.5 * scale;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        elements.push(
          <group key={`flower-${i}`} position={[x, topY + 0.05, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.05, 0.1, 6]} />
              <meshStandardMaterial color="#ff69b4" />
            </mesh>
          </group>
        );
      }
    }

    if (toppings.includes('Macarons')) {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 0.3 * scale;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        elements.push(
          <group key={`macaron-${i}`} position={[x, topY + 0.06, z]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
              <meshStandardMaterial color={['#ffb6c1', '#87ceeb', '#98fb98', '#fffacd'][i]} />
            </mesh>
          </group>
        );
      }
    }

    return <>{elements}</>;
  };

  return (
    <group ref={groupRef}>
      {/* Cake Layers */}
      {Array.from({ length: layers }).map((_, index) => {
        const layerHeight = 0.4;
        const baseY = (index * layerHeight) - ((layers - 1) * layerHeight) / 2;
        
        return (
          <group key={index}>
            {/* Main Cake Layer */}
            <mesh position={[0, baseY, 0]} castShadow receiveShadow>
              {getCakeGeometry(index, layers)}
              <meshStandardMaterial 
                color={getLayerColor(index, layers)} 
                roughness={0.3} 
                metalness={0.1} 
              />
            </mesh>
            
            {/* Layer Icing (except bottom layer) */}
            {index > 0 && (
              <mesh position={[0, baseY - 0.2, 0]} castShadow>
                {getIcingGeometry(index, layers)}
                <meshStandardMaterial color={getColor(color)} roughness={0.2} />
              </mesh>
            )}
            
            {/* Toppings only on top layer */}
            {index === layers - 1 && (
              <>
                {/* Top Icing */}
                <mesh position={[0, baseY + 0.2, 0]} castShadow>
                  {getIcingGeometry(index, layers)}
                  <meshStandardMaterial color={getColor(color)} roughness={0.2} />
                </mesh>
                
                {/* Toppings */}
                <Toppings baseHeight={baseY} layerIndex={index} totalLayers={layers} />
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Main 3D Designer Component
export default function CakeDesigner3D({ onPreviewChange }) {
  const [shape, setShape] = useState('Round');
  const [flavor, setFlavor] = useState('Vanilla');
  const [color, setColor] = useState('White');
  const [toppings, setToppings] = useState([]);
  const [notes, setNotes] = useState('');
  const [layers, setLayers] = useState(1);

  const toggleTopping = (t) => {
    setToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  React.useEffect(() => {
    if (onPreviewChange) onPreviewChange({ shape, flavor, color, toppings, notes, layers });
  }, [shape, flavor, color, toppings, notes, layers]);

  const phone = '260770763960';
  const buildMessage = () => {
    return `Custom cake order:\nShape: ${shape}\nFlavor: ${flavor}\nColor: ${color}\nLayers: ${layers}\nToppings: ${toppings.join(', ') || 'None'}\nNotes: ${notes}`;
  };

  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`;

  return (
    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Design Your 3D Cake</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cake Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {['Round', 'Square', 'Heart'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShape(s)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    shape === s 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Layers</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setLayers(num)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    layers === num 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {num} {num === 1 ? 'Layer' : 'Layers'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flavor</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={flavor} 
              onChange={e => setFlavor(e.target.value)}
            >
              <option>Vanilla</option>
              <option>Chocolate</option>
              <option>Red Velvet</option>
              <option>Lemon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icing Color</label>
            <div className="grid grid-cols-4 gap-2">
              {['White', 'Pink', 'Blue', 'Brown'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    color === c 
                      ? 'border-pink-500 ring-2 ring-pink-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: 
                      c === 'White' ? '#ffffff' :
                      c === 'Pink' ? '#ffb6c1' :
                      c === 'Blue' ? '#87ceeb' : '#8b4513'
                  }}
                >
                  <span className={`${c === 'White' ? 'text-gray-700' : 'text-white'} text-sm font-medium`}>
                    {c}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Toppings</label>
            <div className="flex flex-wrap gap-2">
              {['Sprinkles', 'Fruit', 'Chocolate Shavings', 'Edible Flowers', 'Macarons'].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTopping(t)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    toppings.includes(t) 
                      ? 'bg-pink-100 border-pink-400 text-pink-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Any extra instructions or special requests..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center font-semibold transition-colors"
          >
            Send Design via WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setShape('Round');
              setFlavor('Vanilla');
              setColor('White');
              setToppings([]);
              setNotes('');
              setLayers(1);
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3D Preview Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">3D Live Preview</h3>
        
        <div className="bg-gray-50 rounded-lg h-96 lg:h-[400px] relative overflow-hidden">
          <Canvas shadows camera={{ position: [4, 4, 4], fov: 50 }}>
            <Suspense fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#f3f4f6" />
              </mesh>
            }>
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              
              <Cake3D 
                shape={shape} 
                flavor={flavor} 
                color={color} 
                toppings={toppings} 
                layers={layers} 
              />
              
              <Environment preset="city" />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={3}
                maxDistance={8}
              />
            </Suspense>
          </Canvas>
          
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            Drag to rotate • Scroll to zoom
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div><strong>Shape:</strong> {shape}</div>
            <div><strong>Layers:</strong> {layers}</div>
            <div><strong>Flavor:</strong> {flavor}</div>
            <div><strong>Color:</strong> {color}</div>
            <div><strong>Toppings:</strong> {toppings.length ? toppings.join(', ') : 'None'}</div>
            {notes && <div><strong>Notes:</strong> {notes}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}