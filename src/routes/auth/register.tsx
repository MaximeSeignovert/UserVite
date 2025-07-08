import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '../../components/ui/select';
import type { RegisterData } from '../../types/index';
import { UserRole } from '../../types/index';
import { getDefaultRouteForUser } from '../../providers/AuthProvider';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, register, user } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    "username": '',
    "email": '',
    "password": '',
    "firstname": '',
    "lastname": '',
    "role": UserRole.USER,
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [apiError, setApiError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      const defaultRoute = getDefaultRouteForUser(user);
      navigate({ to: defaultRoute });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    if (!formData.firstname) {
      newErrors.firstname = 'Le prénom est requis';
    }

    if (!formData.lastname) {
      newErrors.lastname = 'Le nom de famille est requis';
    }

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
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

    setIsSubmitting(true);

    try {
      await register(formData);
      // L'utilisateur est automatiquement connecté après l'inscription
      // La redirection sera gérée par l'effect au-dessus
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des changements dans les champs
  const handleChange = (field: keyof RegisterData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
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

  // Gestion du sélecteur de rôle
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value as UserRole,
    }));
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
        <Card className="py-8 px-4 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Prénom */}
            <div>
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="Votre prénom"
                value={formData.firstname}
                onChange={handleChange('firstname')}
                className={errors.firstname ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.firstname && (
                <p className="mt-2 text-sm text-red-600">{errors.firstname}</p>
              )}
            </div>

            {/* Champ Nom */}
            <div>
              <Label htmlFor="lastname">Nom de famille</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Votre nom de famille"
                value={formData.lastname}
                onChange={handleChange('lastname')}
                className={errors.lastname ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.lastname && (
                <p className="mt-2 text-sm text-red-600">{errors.lastname}</p>
              )}
            </div>

            {/* Champ Username */}
            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange('username')}
                className={errors.username ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Champ Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange('email')}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choisissez un mot de passe"
                value={formData.password}
                onChange={handleChange('password')}
                className={errors.password ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Champ Type de compte */}
            <div>
              <Label htmlFor="role">Type de compte</Label>
              <div className="mt-2">
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de compte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.USER}>Client</SelectItem>
                    <SelectItem value={UserRole.DELIVERY}>Livreur</SelectItem>
                    <SelectItem value={UserRole.RESTAURANT}>Restaurateur</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600 mt-1">
                  {formData.role === UserRole.USER && 'Commandez vos repas préférés'}
                  {formData.role === UserRole.DELIVERY && 'Vous pourrez accepter des livraisons'}
                  {formData.role === UserRole.RESTAURANT && 'Gérez votre restaurant et vos commandes'}
                </p>
              </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création du compte...' : 'Créer mon compte'}
            </Button>
          </form>

          {/* Lien vers la connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/auth/login' })}
                className="text-blue-600 hover:text-blue-800 font-medium"
                disabled={isSubmitting}
              >
                Se connecter
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
} 