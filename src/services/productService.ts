import { buildApiUrl, getAuthHeaders, handleApiError } from '../config/api';

// Types pour les produits basés sur les endpoints .NET
export interface Produit {
  id: number;
  name: string;
  description?: string;
  price: number;
  restaurantId: number;
  category?: string;
  isAvailable?: boolean;
  image?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  image?: string;
  address?: string;
  phone?: string;
  isOpen?: boolean;
}

class ProductService {
  /**
   * Récupère un produit par son ID
   * Endpoint: GET /api/Produit/{id}
   */
  async getProduitById(id: number): Promise<Produit> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/produit/api/Produit/${id}`), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Produit avec l'ID ${id} non trouvé`);
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const produit = await response.json();
      return produit;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Récupère tous les restaurants
   * Endpoint: GET /api/Restaurants
   */
  async getRestaurants(): Promise<Restaurant[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/produit/api/Restaurants'), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const restaurants = await response.json();
      return restaurants;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Récupère tous les produits d'un restaurant par son ID
   * Endpoint: GET /api/Restaurants/{id}/Produits
   */
  async getProduitsByRestaurantId(restaurantId: number): Promise<Produit[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/produit/api/Restaurants/${restaurantId}/Produits`), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const produits = await response.json();
      return produits;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export d'une instance unique du service
export const productService = new ProductService();
export default productService;
