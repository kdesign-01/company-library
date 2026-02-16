import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PRIMARY_COLOR } from '../../config/constants';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Shows loading spinner while checking authentication
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 mx-auto mb-4"
            style={{ borderTopColor: PRIMARY_COLOR }}
          ></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render children
  return children;
}
