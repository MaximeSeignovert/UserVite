import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez UserVite Food dès maintenant
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              La page d'inscription sera disponible prochainement.
            </p>
            <button
              onClick={() => navigate({ to: '/auth/login' })}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 