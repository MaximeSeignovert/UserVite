import { useState, useEffect } from 'react';
import { productService, type Restaurant as ApiRestaurant } from '../services/productService';
import type { Restaurant } from '../types';

// Fonction pour mapper les données API vers le format frontend
const mapApiRestaurantToFrontend = (apiRestaurant: ApiRestaurant): Restaurant => {
  // Déduction du type de cuisine basé sur le nom du restaurant
  const getCuisineFromName = (name: string): string[] => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('sushi') || nameLower.includes('zen')) return ['japanese'];
    if (nameLower.includes('pizza') || nameLower.includes('roma')) return ['italian'];
    if (nameLower.includes('burger')) return ['american'];
    if (nameLower.includes('bistro') || nameLower.includes('petit')) return ['french'];
    if (nameLower.includes('taj') || nameLower.includes('mahal')) return ['indian'];
    if (nameLower.includes('dragon') || nameLower.includes('wok')) return ['chinese'];
    if (nameLower.includes('tacos') || nameLower.includes('loco')) return ['mexican'];
    if (nameLower.includes('green') || nameLower.includes('garden')) return ['mediterranean'];
    return ['restaurant'];
  };

  return {
    id: apiRestaurant.id.toString(),
    name: apiRestaurant.name,
    description: apiRestaurant.description || 'Description non disponible',
    image: apiRestaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700',
    rating: 4.5, // Note par défaut car pas dans l'API
    deliveryTime: '25-35 min', // Temps par défaut car pas dans l'API
    deliveryFee: 2.50, // Frais par défaut car pas dans l'API
    cuisine: getCuisineFromName(apiRestaurant.name),
    isOpen: apiRestaurant.isOpen ?? true, // Utilise la valeur de l'API si disponible
    promo: undefined
  };
};

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiRestaurants = await productService.getRestaurants();
      const mappedRestaurants = apiRestaurants.map(mapApiRestaurantToFrontend);
      setRestaurants(mappedRestaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des restaurants');
      console.error('Erreur lors du chargement des restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants
  };
}; 