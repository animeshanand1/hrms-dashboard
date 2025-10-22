import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRole = (allowed) => {
    if (!user) return false;
    if (!allowed) return true;
    if (Array.isArray(allowed)) return allowed.includes(user.role);
    return user.role === allowed;
  };

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
