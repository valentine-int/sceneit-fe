import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090A0F] text-[#93939A]">
        <i className="ri-loader-4-line animate-spin text-2xl"></i>
      </main>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;