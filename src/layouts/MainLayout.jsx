import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="./Logo.png"
                  alt="MediaMatch Logo" 
                  className="h-12 w-auto object-contain"
                  style={{ maxWidth: '180px' }}
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500"
              >
                Dashboard
              </Link>
              <Link 
                to="/discover" 
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Discover
              </Link>
              <Link 
                to="/watchlist" 
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Watchlist
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="./Logo.png"
                  alt="MediaMatch Logo" 
                  className="h-10 w-auto object-contain"
                  style={{ maxWidth: '150px' }}
                />
              </div>
              <p className="text-gray-600">
                Your personalized entertainment companion for discovering books and movies that match your taste.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link></li>
                <li><Link to="/discover" className="text-gray-600 hover:text-indigo-600">Discover</Link></li>
                <li><Link to="/watchlist" className="text-gray-600 hover:text-indigo-600">My Lists</Link></li>
                <li><Link to="/settings" className="text-gray-600 hover:text-indigo-600">Settings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/contact" className="text-gray-600 hover:text-indigo-600">Contact Us</Link></li>
                <li><Link to="/faq" className="text-gray-600 hover:text-indigo-600">FAQ</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-indigo-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} MediaMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 