import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import type { LoginCredentials } from '../types/index';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [apiError, setApiError] = useState<string>('');

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!credentials.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    try {
      await login(credentials);
      onSuccess?.();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  // Gestion des changements dans les champs
  const handleChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Fonction pour remplir les champs avec un utilisateur de test
  const fillTestUser = () => {
    setCredentials({
      email: 'marie.dupont@email.com',
      password: 'password123',
    });
    setErrors({});
    setApiError('');
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-gray-600 mt-2">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Bouton de test pour le développement */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            Mode développement - Utilisateur de test :
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillTestUser}
            className="w-full"
          >
            Utiliser Marie Dupont (Test)
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={credentials.email}
              onChange={handleChange('email')}
              className={errors.email ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={credentials.password}
              onChange={handleChange('password')}
              className={errors.password ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Erreur API */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
          )}

          {/* Bouton de soumission */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        {/* Lien vers l'inscription */}
        {onSwitchToRegister && (
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-800 font-medium"
                disabled={isLoading}
              >
                Créer un compte
              </button>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}; 