// Configuration pour l'API backend Flask
export const API_CONFIG = {
  // URL de base de l'API Flask sur le port 7283
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7283',
  
  // Endpoints d'authentification Flask
  AUTH: {
    LOGIN: '/auth/api/auth/login',
    REGISTER: '/auth/api/auth/register',
    REGISTER_LIVREUR: '/gateway/RegisterLivreur',
    PROFILE: '/auth/api/auth/profile',
  },
  
  // Endpoints des ressources (à adapter selon votre API Flask)
  RESTAURANTS: '/restaurants',
  ORDERS: '/orders',
  USERS: '/users',
  DELIVERY: '/delivery',
  COMMANDES: {
    BASE: '/commande/api/commande',
    ACCEPT: '/commande/api/commande/accept',      // PATCH /api/commande/accept/{id}
    PREPARE: '/commande/api/commande/prepare',    // PATCH /api/commande/prepare/{id}
    READY: '/commande/api/commande/ready',        // PATCH /api/commande/ready/{id}
  },
  
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
  
  headers['Content-Type'] = 'application/json';

  return headers;
};

// Fonction utilitaire pour gérer les erreurs d'API Flask
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string };
    return errorWithMessage.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Une erreur inattendue est survenue';
}; 