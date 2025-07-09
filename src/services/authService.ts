import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiError } from '../config/api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthUser, 
  LoginResponse,
  ProfileResponse
} from '../types/index';
import { UserRole } from '../types/index';

// Service d'authentification pour Flask
export class AuthService {
  // Connexion utilisateur avec Flask
  static async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN), {
        method: 'POST',
        headers: getAuthHeaders(null),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }

      const data: LoginResponse = await response.json();

      // Récupérer le profil utilisateur avec le token
      const user = await this.getProfile(data.access_token);

      return {
        user,
        token: data.access_token
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Inscription utilisateur avec Flask
  static async register(userData: RegisterData): Promise<{ user: AuthUser; token: string }> {
    try {

      let response;
      if (userData.role === UserRole.DELIVERY) {
        response = await fetch(buildApiUrl(API_CONFIG.AUTH.REGISTER_LIVREUR), {
          method: 'POST',
          headers: getAuthHeaders(null),
          body: JSON.stringify(userData),
        });
      }else{
        response = await fetch(buildApiUrl(API_CONFIG.AUTH.REGISTER), {
        method: 'POST',
        headers: getAuthHeaders(null),
        body: JSON.stringify(userData),
      });
    }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur d\'inscription');
      }

      // Flask retourne juste un message de succès pour register
      // On doit maintenant se connecter avec les identifiants
      return await this.login({
        username: userData.username,
        password: userData.password
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Déconnexion (simple nettoyage côté client pour Flask JWT)
  static async logout(): Promise<void> {
    // Avec Flask-JWT-Extended, la déconnexion se fait côté client
    // en supprimant le token du localStorage
    return Promise.resolve();
  }

  // Obtenir le profil utilisateur avec Flask
  static async getProfile(token: string): Promise<AuthUser> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.PROFILE), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de récupération du profil');
      }

      const data: ProfileResponse = await response.json();

      // Adapter la réponse Flask au format AuthUser
      const user: AuthUser = {
        id: '', // À extraire du JWT si nécessaire
        username: data.username,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        role: data.role,
        created_at: data.created_at,
        addresses: [], // À adapter selon vos besoins
        favoriteRestaurants: [],
        profilePicture: '',
      };

      return user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour le profil (à implémenter selon votre API Flask)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async updateProfile(token: string, _userData: Partial<AuthUser>): Promise<AuthUser> {
    try {
      // Cette méthode dépend de votre implémentation Flask
      // Pour l'instant, on retourne juste le profil actuel
      return await this.getProfile(token);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Décoder le JWT pour obtenir l'ID utilisateur
  static decodeJWT(token: string): { userId: string } | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { userId: payload.sub };
    } catch {
      return null;
    }
  }
} 