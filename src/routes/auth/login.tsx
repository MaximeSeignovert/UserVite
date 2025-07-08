import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '../../components/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { getDefaultRouteForUser } from '../../providers/AuthProvider';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      const defaultRoute = getDefaultRouteForUser(user);
      navigate({ to: defaultRoute });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Fonction appelée après une connexion réussie
  const handleLoginSuccess = () => {
    // On attend que le user soit disponible pour déterminer la route
    // La redirection sera gérée par l'effect au-dessus
  };

  // Fonction pour aller vers la page d'inscription
  const handleSwitchToRegister = () => {
    navigate({ to: '/auth/register' });
  };

  // Afficher un loader pendant la vérification de l'auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Ne pas afficher la page si déjà connecté
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Logo de l'app */}
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            UserVite Food
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Votre plateforme de livraison de repas
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      </div>

      {/* Informations de développement */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Mode Développement
          </h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>Email:</strong> marie.dupont@email.com</p>
            <p><strong>Mot de passe:</strong> n'importe lequel (6+ caractères)</p>
            <p className="mt-2">
              <em>En production, cela sera connecté à votre API JWT.</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 