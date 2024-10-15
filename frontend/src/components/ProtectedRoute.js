import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.user?.user);

  if (!user) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    // If the user doesn't have the required role, redirect to the home page or a 403 page
    return <Navigate to="/" />;
  }

  // If the user is authenticated and has the correct role, render the children components
  return children;
};

export default ProtectedRoute;
