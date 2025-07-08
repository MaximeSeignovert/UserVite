import { useState, useEffect } from 'react';
import { productService, type Produit } from '../services/productService';
import type { MenuItem } from '../types';

// Fonction pour mapper les données API vers le format frontend
const mapApiProduitToMenuItem = (produit: Produit): MenuItem => {
  // Déduction des propriétés alimentaires basée sur le nom du produit
  const getVeggieStatus = (name: string, description?: string) => {
    const text = `${name} ${description || ''}`.toLowerCase();
    const isVegan = text.includes('végan') || text.includes('vegan') || 
                   text.includes('quinoa') || text.includes('avocat') ||
                   text.includes('légumes');
    const isVegetarian = isVegan || text.includes('végé') || text.includes('fromage') ||
                        text.includes('salade') || text.includes('smoothie');
    return { isVegetarian, isVegan };
  };

  // Déduction de la popularité basée sur le nom
  const isPopular = produit.name.toLowerCase().includes('signature') ||
                   produit.name.toLowerCase().includes('spécial') ||
                   produit.name.toLowerCase().includes('classic');

  const { isVegetarian, isVegan } = getVeggieStatus(produit.name, produit.description);

  return {
    id: produit.id.toString(),
    name: produit.name,
    description: produit.description || 'Description non disponible',
    price: produit.price,
    image: produit.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300',
    category: produit.category || 'Plats principaux',
    isPopular,
    allergens: undefined,
    isVegetarian,
    isVegan
  };
};

export const useMenuItems = (restaurantId: string | number) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    if (!restaurantId) {
      setMenuItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const numericRestaurantId = typeof restaurantId === 'string' ? parseInt(restaurantId) : restaurantId;
      const produits = await productService.getProduitsByRestaurantId(numericRestaurantId);
      const mappedMenuItems = produits.map(mapApiProduitToMenuItem);
      setMenuItems(mappedMenuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      console.error('Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenuItems
  };
};

export const useSingleProduct = (productId: string | number) => {
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const numericProductId = typeof productId === 'string' ? parseInt(productId) : productId;
      const produit = await productService.getProduitById(numericProductId);
      const mappedProduct = mapApiProduitToMenuItem(produit);
      setProduct(mappedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
      console.error('Erreur lors du chargement du produit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
}; 