// Configuration pour l'API backend
export const API_CONFIG = {
  // URL de base de l'API (à configurer selon l'environnement)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Endpoints d'authentification
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  
  // Endpoints des ressources
  RESTAURANTS: '/restaurants',
  ORDERS: '/orders',
  USERS: '/users',
  DELIVERY: '/delivery',
  
  // Configuration des timeouts
  TIMEOUT: 10000, // 10 secondes
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Fonction utilitaire pour construire les URLs complètes
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction utilitaire pour obtenir les headers avec JWT
export const getAuthHeaders = (token: string | null) => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Types pour les réponses API standardisées
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

// Fonction utilitaire pour gérer les erreurs d'API
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Une erreur inattendue est survenue';
}; 