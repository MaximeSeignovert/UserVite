import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import type { 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  AuthUser
} from '../types/index';

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Fonction utilitaire pour déterminer la route par défaut selon le rôle
export const getDefaultRouteForUser = (user: AuthUser | null): string => {
  if (!user) return '/';
  
  switch (user.role) {
    case 'delivery':
      return '/delivery/dashboard';
    case 'restaurant':
      return '/restaurant/dashboard';
    case 'user':
    default:
      return '/';
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Fonction pour vérifier si le token est expiré
  const isTokenExpired = (token: string): boolean => {
    const decoded = AuthService.decodeJWT(token);
    if (!decoded) return true;
    
    // Décoder le JWT pour vérifier l'expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser && !isTokenExpired(storedToken)) {
          const user = JSON.parse(storedUser) as AuthUser;
          setAuthState({
            user,
            token: storedToken,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          // Token expiré ou invalide, nettoyer le storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadStoredAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await AuthService.login(credentials);

      // Extraire l'ID utilisateur du token et l'ajouter au user
      const decoded = AuthService.decodeJWT(response.token);
      const userWithId = {
        ...response.user,
        id: decoded?.userId || response.user.id
      };

      // Sauvegarder dans localStorage
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithId));

      setAuthState({
        user: userWithId,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
    try {
      // Appeler l'API de déconnexion (nettoyage côté client pour Flask JWT)
      await AuthService.logout();
    } catch (error) {
      console.warn('Erreur lors de la déconnexion API:', error);
    } finally {
      // Nettoyer le localStorage et l'état local
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  // Fonction d'inscription
  const register = async (userData: RegisterData): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await AuthService.register(userData);

      // Extraire l'ID utilisateur du token et l'ajouter au user
      const decoded = AuthService.decodeJWT(response.token);
      const userWithId = {
        ...response.user,
        id: decoded?.userId || response.user.id
      };

      // Sauvegarder dans localStorage
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userWithId));

      setAuthState({
        user: userWithId,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (userData: Partial<AuthUser>): Promise<void> => {
    if (!authState.user || !authState.token) {
      throw new Error('Utilisateur non connecté');
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedUser = await AuthService.updateProfile(authState.token, userData);
      
      // Mettre à jour localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const contextValue = {
    ...authState,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 