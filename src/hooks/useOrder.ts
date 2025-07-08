import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import type { 
  Commande, 
  CommandeDetails, 
  OrderDetails, 
  CreateCommandeRequest,
  CartItem,
  Address,
  LigneCommande
} from '../types';

interface UseOrderReturn {
  // État
  loading: boolean;
  error: string | null;
  currentOrder: CommandeDetails | null;
  
  // Actions
  createOrder: (orderDetails: OrderDetails) => Promise<Commande | null>;
  getOrderById: (orderId: string) => Promise<CommandeDetails | null>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  clearError: () => void;
  
  // Utilitaires
  calculateTotal: (cartItems: CartItem[], deliveryFee?: number, taxRate?: number) => number;
  formatOrderForApi: (orderDetails: OrderDetails) => CreateCommandeRequest;
  parseOrderFromApi: (commande: Commande) => CommandeDetails;
}

export const useOrder = (): UseOrderReturn => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<CommandeDetails | null>(null);

  // Nettoyer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calculer le total d'une commande
  const calculateTotal = useCallback((
    cartItems: CartItem[], 
    deliveryFee: number = 3.90, 
    taxRate: number = 0.1
  ): number => {
    const subtotal = cartItems.reduce((total, item) => 
      total + (item.menuItem.price * item.quantity), 0
    );
    const taxes = subtotal * taxRate;
    return subtotal + deliveryFee + taxes;
  }, []);

  // Convertir CartItem vers LigneCommande
  const convertCartItemsToLignesCommande = useCallback((cartItems: CartItem[]): LigneCommande[] => {
    return cartItems.map(item => ({
      produitId: item.menuItem.id,
      quantite: item.quantity,
      prixUnitaire: Math.round(item.menuItem.price * 100) // Convertir en centimes
    }));
  }, []);

  // Formater les données pour l'API
  const formatOrderForApi = useCallback((orderDetails: OrderDetails): CreateCommandeRequest => {
    const lignesCommande = convertCartItemsToLignesCommande(orderDetails.cartItems);
    const prixTotalCentimes = Math.round(orderDetails.totalPrice * 100); // Convertir en centimes

    return {
      clientId: orderDetails.clientId,
      restaurantId: orderDetails.restaurantId,
      produits: lignesCommande,
      prixTotal: prixTotalCentimes,
      statut: orderDetails.status
    };
  }, [convertCartItemsToLignesCommande]);

  // Parser les données de l'API pour reconstituer les CartItems
  const parseOrderFromApi = useCallback((commande: Commande): CommandeDetails => {
    const parsedCartItems: CartItem[] = [];
    
    // Pour l'instant, on ne peut pas reconstituer complètement les CartItems
    // car on n'a que l'ID du produit dans LigneCommande
    // Il faudrait faire des appels API supplémentaires pour récupérer les détails des produits
    
    const totalPriceEuros = commande.prixTotal / 100; // Convertir de centimes vers euros

    return {
      ...commande,
      parsedCartItems,
      totalPriceEuros
    };
  }, []);

  // Créer une nouvelle commande
  const createOrder = useCallback(async (orderDetails: OrderDetails): Promise<Commande | null> => {
    if (!user) {
      setError('Utilisateur non connecté');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = formatOrderForApi({
        ...orderDetails,
        clientId: user.id
      });

      const newOrder = await orderService.createCommande(orderData, token);
      
      // Mettre à jour l'état local avec les détails complets
      const orderDetails_parsed = parseOrderFromApi(newOrder);
      setCurrentOrder(orderDetails_parsed);
      
      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la commande';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, token, formatOrderForApi, parseOrderFromApi]);

  // Récupérer une commande par ID
  const getOrderById = useCallback(async (orderId: string): Promise<CommandeDetails | null> => {
    setLoading(true);
    setError(null);

    try {
      const commande = await orderService.getCommandeById(orderId, token);
      const orderDetails = parseOrderFromApi(commande);
      setCurrentOrder(orderDetails);
      return orderDetails;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la commande';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, parseOrderFromApi]);

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = useCallback(async (orderId: string, status: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await orderService.updateCommandeStatus(orderId, status, token);
      
      // Mettre à jour l'état local si c'est la commande courante
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(prev => prev ? { ...prev, statut: status } : null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, currentOrder]);

  return {
    // État
    loading,
    error,
    currentOrder,
    
    // Actions
    createOrder,
    getOrderById,
    updateOrderStatus,
    clearError,
    
    // Utilitaires
    calculateTotal,
    formatOrderForApi,
    parseOrderFromApi
  };
}; 