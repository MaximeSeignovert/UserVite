import type { 
  Commande, 
  CreateCommandeRequest, 
  UpdateCommandeRequest
} from '../types';
import { UnifiedOrderStatus } from '../types';
import { buildApiUrl, getAuthHeaders, handleApiError, API_CONFIG } from '../config/api';

class OrderService {
  private readonly baseUrl = buildApiUrl(API_CONFIG.COMMANDES.BASE);

  // Récupérer toutes les commandes
  async getCommandes(token: string | null): Promise<Commande[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes: ${handleApiError(error)}`);
    }
  }

  // Récupérer une commande par ID
  async getCommandeById(id: string, token: string | null): Promise<Commande> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la commande: ${handleApiError(error)}`);
    }
  }

  // Créer une nouvelle commande
  async createCommande(commandeData: CreateCommandeRequest, token: string | null): Promise<Commande> {
    try {
      // Ajouter la date de création automatiquement
      const newCommande = {
        ...commandeData,
        dateCréation: new Date().toISOString(),
        statut: commandeData.statut || UnifiedOrderStatus.PENDING
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(newCommande),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Données de commande invalides');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la commande: ${handleApiError(error)}`);
    }
  }

  // Mettre à jour une commande existante
  async updateCommande(id: string, commandeData: UpdateCommandeRequest, token: string | null): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(commandeData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la commande: ${handleApiError(error)}`);
    }
  }

  // Supprimer une commande
  async deleteCommande(id: string, token: string | null): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la commande: ${handleApiError(error)}`);
    }
  }

  // Méthodes utilitaires supplémentaires

  // Récupérer les commandes d'un client spécifique
  async getCommandesByClientId(clientId: string, token: string | null): Promise<Commande[]> {
    try {
      const allCommandes = await this.getCommandes(token);
      return allCommandes.filter(commande => commande.clientId === clientId);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes du client: ${handleApiError(error)}`);
    }
  }

  // Récupérer les commandes d'un restaurant spécifique
  async getCommandesByRestaurantId(restaurantId: string, token: string | null): Promise<Commande[]> {
    try {
      const allCommandes = await this.getCommandes(token);
      return allCommandes.filter(commande => commande.restaurantId === restaurantId);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes du restaurant: ${handleApiError(error)}`);
    }
  }

  // Mettre à jour le statut d'une commande
  async updateCommandeStatus(id: string, statut: UnifiedOrderStatus, token: string | null): Promise<void> {
    try {
      await this.updateCommande(id, { statut }, token);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${handleApiError(error)}`);
    }
  }

  // Vérifier si une commande peut être annulée
  canCancelCommande(commande: Commande): boolean {
    const cancellableStatuses = [
      UnifiedOrderStatus.PENDING,
      UnifiedOrderStatus.CONFIRMED,
      UnifiedOrderStatus.PREPARING
    ];
    return cancellableStatuses.includes(commande.statut as UnifiedOrderStatus);
  }

  // Annuler une commande
  async cancelCommande(id: string, token: string | null): Promise<void> {
    try {
      const commande = await this.getCommandeById(id, token);
      
      if (!this.canCancelCommande(commande)) {
        throw new Error('Cette commande ne peut pas être annulée');
      }

      await this.updateCommandeStatus(id, UnifiedOrderStatus.CANCELLED, token);
    } catch (error) {
      throw new Error(`Erreur lors de l'annulation de la commande: ${handleApiError(error)}`);
    }
  }

  // === Méthodes spécifiques pour les restaurateurs ===
  
  // Accepter/Confirmer une commande
  async acceptCommande(id: string, token: string | null): Promise<void> {
    try {
      const url = buildApiUrl(`${API_CONFIG.COMMANDES.ACCEPT}/${id}`);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de l'acceptation de la commande: ${handleApiError(error)}`);
    }
  }

  // Démarrer la préparation d'une commande
  async prepareCommande(id: string, token: string | null): Promise<void> {
    try {
      const url = buildApiUrl(`${API_CONFIG.COMMANDES.PREPARE}/${id}`);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors du démarrage de la préparation: ${handleApiError(error)}`);
    }
  }

  // Marquer une commande comme prête
  async readyCommande(id: string, token: string | null): Promise<void> {
    try {
      const url = buildApiUrl(`${API_CONFIG.COMMANDES.READY}/${id}`);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Commande non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la finalisation de la commande: ${handleApiError(error)}`);
    }
  }

  // Méthode générique pour changer le statut d'une commande (pour les restaurateurs)
  async updateRestaurantOrderStatus(id: string, status: UnifiedOrderStatus, token: string | null): Promise<void> {
    try {
      switch (status) {
        case UnifiedOrderStatus.CONFIRMED:
          await this.acceptCommande(id, token);
          break;
        case UnifiedOrderStatus.PREPARING:
          await this.prepareCommande(id, token);
          break;
        case UnifiedOrderStatus.READY:
          await this.readyCommande(id, token);
          break;
        case UnifiedOrderStatus.CANCELLED:
          await this.cancelCommande(id, token);
          break;
        default:
          throw new Error(`Statut non supporté: ${status}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors du changement de statut: ${handleApiError(error)}`);
    }
  }
}

// Instance singleton du service
export const orderService = new OrderService();
export default orderService;
