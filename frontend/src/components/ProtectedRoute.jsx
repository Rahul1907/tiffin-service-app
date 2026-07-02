import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-650"></div>
        <p className="mt-4 text-slate-550 font-semibold animate-pulse">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // Redirect to homepage if trying to access admin pages as customer
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
