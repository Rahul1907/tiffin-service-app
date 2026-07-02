import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, User, ChefHat } from 'lucide-react';
import { useSelector } from 'react-redux';
import MenuPage from './pages/MenuPage.jsx';

function App() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="sticky top-0 z-50 glassmorphism shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-amber-600">
                  <span className="text-2xl">🍱</span>
                  <span>TiffinExpress</span>
                </Link>
              </div>
              <nav className="flex space-x-4 items-center">
                <Link to="/" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">Menu</Link>
                <Link to="/cart" className="relative p-2 text-slate-600 hover:text-amber-600 transition-colors">
                  <ShoppingBag size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/login" className="p-2 text-slate-600 hover:text-amber-600 transition-colors">
                  <User size={22} />
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/cart" element={<div className="text-center py-12 text-slate-600">Cart Page (Phase 4)</div>} />
            <Route path="/login" element={<div className="text-center py-12 text-slate-600">Login Page (Phase 3)</div>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-auto border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} TiffinExpress. All rights reserved.</p>
            <p className="mt-1 text-slate-600">Made with ❤️ for Ahmedabad Home Cooking.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
