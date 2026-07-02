import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import MenuPage from './pages/MenuPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { logout } from './store/slices/authSlice.js';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="sticky top-0 z-50 glassmorphism shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-6">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-amber-600">
                  <span className="text-2xl">🍱</span>
                  <span>TiffinExpress</span>
                </Link>
                <Link to="/" className="text-slate-600 hover:text-amber-600 transition-colors font-bold text-sm">Menu</Link>
              </div>
              <nav className="flex space-x-4 items-center">
                {/* Admin Dashboard Link */}
                {isAuthenticated && user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-amber-600 hover:text-amber-700 transition-colors font-bold text-xs bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Profile Pill & Logout */}
                {isAuthenticated && (
                  <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                        {user?.name || user?.phone || user?.email}
                      </span>
                      {user?.role === 'admin' && (
                        <span className="text-[10px] text-amber-600 font-extrabold flex items-center justify-end">
                          <Shield size={10} className="mr-0.5" />
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Log Out"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
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
