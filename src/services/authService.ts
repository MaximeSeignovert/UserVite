import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiError } from '../config/api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthUser, 
  LoginResponse, 
  ApiResponse 
} from '../types/index';

// Service d'authentification
export class AuthService {
  // Connexion utilisateur
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // En développement, utiliser les mocks
      if (import.meta.env.DEV) {
        return this.mockLogin(credentials);
      }

      // En production, appeler l'API réelle
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN), {
        method: 'POST',
        headers: getAuthHeaders(null),
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<LoginResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      return data.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Inscription utilisateur
  static async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      // En développement, utiliser les mocks
      if (import.meta.env.DEV) {
        return this.mockRegister(userData);
      }

      // En production, appeler l'API réelle
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.REGISTER), {
        method: 'POST',
        headers: getAuthHeaders(null),
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<LoginResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur d\'inscription');
      }

      return data.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Rafraîchir le token
  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.REFRESH), {
        method: 'POST',
        headers: getAuthHeaders(null),
        body: JSON.stringify({ refreshToken }),
      });

      const data: ApiResponse<LoginResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur de rafraîchissement du token');
      }

      return data.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Déconnexion
  static async logout(token: string): Promise<void> {
    try {
      if (import.meta.env.DEV) {
        // En développement, juste nettoyer le localStorage
        return;
      }

      await fetch(buildApiUrl(API_CONFIG.AUTH.LOGOUT), {
        method: 'POST',
        headers: getAuthHeaders(token),
      });
    } catch (error) {
      // En cas d'erreur de déconnexion, on continue (nettoyage local)
      console.warn('Erreur lors de la déconnexion:', error);
    }
  }

  // Obtenir le profil utilisateur
  static async getProfile(token: string): Promise<AuthUser> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.PROFILE), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data: ApiResponse<AuthUser> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur de récupération du profil');
      }

      return data.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour le profil
  static async updateProfile(token: string, userData: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.PROFILE), {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<AuthUser> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur de mise à jour du profil');
      }

      return data.data!;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // --- MÉTHODES MOCK POUR LE DÉVELOPPEMENT ---

  private static async mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Importer les mocks dynamiquement pour éviter les problèmes de dépendances
    const { mockUsers } = await import('../data/index');
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // En développement, accepter n'importe quel mot de passe
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      favoriteRestaurants: user.favoriteRestaurants,
      profilePicture: user.profilePicture,
    };

    // Simuler un JWT token
    const mockToken = `mock.${btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (24 * 60 * 60), // 24h
    }))}.signature`;

    return {
      user: authUser,
      token: mockToken,
    };
  }

  private static async mockRegister(userData: RegisterData): Promise<LoginResponse> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { mockUsers } = await import('../data/index');
    
    // Vérifier si l'email existe déjà
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Créer un nouvel utilisateur
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      addresses: [],
      favoriteRestaurants: [],
      profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces', // Image par défaut
    };

    // Simuler un JWT token
    const mockToken = `mock.${btoa(JSON.stringify({
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (24 * 60 * 60), // 24h
    }))}.signature`;

    return {
      user: newUser,
      token: mockToken,
    };
  }
} 