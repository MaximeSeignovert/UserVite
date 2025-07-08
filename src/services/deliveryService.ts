import { buildApiUrl, getAuthHeaders, handleApiError } from '../config/api';
import type { 
  Livreur,
  Livraison,
  LivreurStats,
  CreateLivreurRequest,
  UpdateLivreurRequest,
  CreateLivraisonRequest,
  UpdateLivraisonStatusRequest
} from '../types/index';

// Configuration des endpoints de livraison
const DELIVERY_ENDPOINTS = {
  LIVREURS: '/livraison/livreurs',
  LIVRAISONS: '/livraison/livraisons',
  LIVRAISONS_DISPONIBLES: '/livraison/livraisons/disponibles',
  LIVREUR_LIVRAISONS: (idLivreur: string) => `/livraison/livreurs/${idLivreur}/livraisons`,
  LIVREUR_BY_ID: (id: string) => `/livraison/livreurs/${id}`,
  LIVRAISON_BY_ID: (id: string) => `/livraison/livraisons/${id}`,
  UPDATE_LIVRAISON_STATUS: (id: string) => `/livraison/livraisons/${id}/status`,
};

// Service pour l'API de livraisons
export class DeliveryService {
  
  // === LIVREURS ===
  
  // Obtenir tous les livreurs
  static async getAllLivreurs(token: string): Promise<Livreur[]> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREURS), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des livreurs');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Obtenir un livreur par ID
  static async getLivreurById(id: string, token: string): Promise<Livreur> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREUR_BY_ID(id)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération du livreur');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Créer un nouveau livreur
  static async createLivreur(livreurData: CreateLivreurRequest, token: string): Promise<Livreur> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREURS), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(livreurData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du livreur');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour un livreur
  static async updateLivreur(id: string, livreurData: UpdateLivreurRequest, token: string): Promise<Livreur> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREUR_BY_ID(id)), {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(livreurData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du livreur');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Supprimer un livreur
  static async deleteLivreur(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREUR_BY_ID(id)), {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression du livreur');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // === LIVRAISONS ===

  // Obtenir toutes les livraisons
  static async getAllLivraisons(token: string): Promise<Livraison[]> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVRAISONS), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des livraisons');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Obtenir les livraisons disponibles
  static async getAvailableLivraisons(token: string): Promise<Livraison[]> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVRAISONS_DISPONIBLES), {
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

  // Obtenir une livraison par ID
  static async getLivraisonById(id: string, token: string): Promise<Livraison> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVRAISON_BY_ID(id)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération de la livraison');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Obtenir les livraisons d'un livreur
  static async getLivraisonsByLivreur(idLivreur: string, token: string): Promise<Livraison[]> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVREUR_LIVRAISONS(idLivreur)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des livraisons du livreur');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Créer une nouvelle livraison
  static async createLivraison(livraisonData: CreateLivraisonRequest, token: string): Promise<Livraison> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.LIVRAISONS), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(livraisonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la livraison');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour le statut d'une livraison
  static async updateLivraisonStatus(id: string, statusData: UpdateLivraisonStatusRequest, token: string): Promise<Livraison> {
    try {
      const response = await fetch(buildApiUrl(DELIVERY_ENDPOINTS.UPDATE_LIVRAISON_STATUS(id)), {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du statut');
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // === FONCTIONS UTILITAIRES ===

  // Calculer les statistiques livreur (sera mockée pour l'instant)
  static async getLivreurStats(idLivreur: string, token: string): Promise<LivreurStats> {
    try {
      // Pour l'instant, on calcule les stats à partir des livraisons
      const livraisons = await this.getLivraisonsByLivreur(idLivreur, token);
      
      const today = new Date().toDateString();
      const todayDeliveries = livraisons.filter(l => 
        new Date(l.created_at).toDateString() === today && l.status === 'delivered'
      ).length;
      
      const totalDeliveries = livraisons.filter(l => l.status === 'delivered').length;
      const totalEarnings = livraisons
        .filter(l => l.status === 'delivered')
        .reduce((sum, l) => sum + (l.totalAmount * 0.1), 0); // 10% commission exemple
      
      return {
        todayDeliveries,
        totalEarnings,
        averageRating: 4.8, // Mockée pour l'instant
        completionRate: totalDeliveries > 0 ? (totalDeliveries / livraisons.length) * 100 : 100,
        totalDeliveries
      };
    } catch (error) {
      console.error('Erreur lors du calcul des stats:', error);
      // En cas d'erreur, retourner des stats par défaut
      return {
        todayDeliveries: 0,
        totalEarnings: 0,
        averageRating: 0,
        completionRate: 0,
        totalDeliveries: 0
      };
    }
  }

  // Assigner une livraison à un livreur (met à jour le statut vers 'assigned')
  static async assignLivraison(livraisonId: string, livreurId: string, token: string): Promise<Livraison> {
    try {
      return await this.updateLivraisonStatus(livraisonId, { 
        status: 'assigned' 
      }, token);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
} 