import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
