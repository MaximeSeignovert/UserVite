import { buildApiUrl, getAuthHeaders, handleApiError } from '../config/api';
import type { 
  Livreur,
  Livraison
} from '../types/index';

// Configuration des endpoints de livraison basés sur les routes back-end
const DELIVERY_ENDPOINTS = {
  // Routes livreurs
  LIVREUR_BY_ID: (id: string) => `/livraison/livreurs/${id}`,
  
  // Routes livraisons
  LIVRAISONS_AVAILABLE: '/livraison/livraisons/available',
  LIVRAISON_BY_ID: (livraisonId: string) => `/livraison/livraisons/${livraisonId}`,
  LIVREUR_LIVRAISONS: (livreurId: string) => `/livraison/livreur/${livreurId}/livraisons`,
};

// Service pour l'API de livraisons
export class DeliveryService {
  
  // === ROUTES GET LIVREURS ===
  
  /**
   * Obtenir un livreur par ID
   * Correspond à : GET /livreurs/:id
   */
  static async getLivreurById(id: string, token: string): Promise<Livreur> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREUR_BY_ID(id)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur lors de la récupération du livreur ${id}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // === ROUTES GET LIVRAISONS ===

  /**
   * Obtenir les livraisons disponibles pour les livreurs
   * Utilisé dans le dashboard livreur pour afficher les livraisons disponibles
   * Correspond à : GET /livraisons/available
   */
  static async getAvailableLivraisons(token: string): Promise<Livraison[]> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVRAISONS_AVAILABLE), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des livraisons disponibles');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Obtenir une livraison par ID
   * Utilisé dans l'Order Tracker pour obtenir les infos de livraison
   * Correspond à : GET /livraisons/:livraisonId
   */
  static async getLivraisonById(livraisonId: string, token: string): Promise<Livraison> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVRAISON_BY_ID(livraisonId)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur lors de la récupération de la livraison ${livraisonId}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Obtenir les livraisons d'un livreur spécifique
   * Utilisé dans le dashboard livreur pour voir ses livraisons
   * Correspond à : GET /livreur/:livreurId/livraisons
   */
  static async getLivraisonsByLivreur(livreurId: string, token: string): Promise<Livraison[]> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREUR_LIVRAISONS(livreurId)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur lors de la récupération des livraisons du livreur ${livreurId}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
} 