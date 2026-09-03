import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Designer from './pages/Designer';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminCakes from './pages/AdminCakes';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        setCurrentPage('admin-login');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'catalogue':
        return <Catalogue setCurrentPage={setCurrentPage} />;
      case 'designer':
        return <Designer setCurrentPage={setCurrentPage} />;
      case 'about':
        return <About setCurrentPage={setCurrentPage} />;
      case 'admin-login':
        return <AdminLogin setCurrentPage={setCurrentPage} />;
      case 'admin-cakes':
        return <AdminCakes setCurrentPage={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboard setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}