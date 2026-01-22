import { Navigate } from 'react-router-dom';
import { isUniversityAuthenticated } from '@/lib/universityAuth';

interface ProtectedUniversityRouteProps {
  children: React.ReactNode;
}

export const ProtectedUniversityRoute = ({ children }: ProtectedUniversityRouteProps) => {
  if (!isUniversityAuthenticated()) {
    // Redirect to university login if not authenticated
    return <Navigate to="/university/login" replace />;
  }

  return <>{children}</>;
};
