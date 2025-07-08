import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/' 
}: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si pas connecté, rediriger vers login
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/auth/login' });
      return;
    }

    // Si connecté mais pas le bon rôle, rediriger vers fallback
    if (!isLoading && isAuthenticated && user) {
      const userRole = user.role || 'user';
      if (!allowedRoles.includes(userRole)) {
        navigate({ to: fallbackPath });
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, allowedRoles, fallbackPath]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Si pas connecté ou pas le bon rôle, ne rien afficher
  if (!isAuthenticated || !user) {
    return null;
  }

  const userRole = user.role || 'user';
  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  // Afficher le contenu si tout est OK
  return <>{children}</>;
}; 