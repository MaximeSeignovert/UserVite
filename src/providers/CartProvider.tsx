import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, MenuItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void;
  removeFromCart: (menuItemId: string, specialInstructions?: string) => void;
  updateQuantity: (menuItemId: string, newQuantity: number, specialInstructions?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = 'uservite-cart';

export const CartProvider = ({ children }: CartProviderProps) => {
  // Initialiser le panier depuis localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        return [];
      }
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error);
      }
    }
  }, [cartItems]);

  const addToCart = useCallback((menuItem: MenuItem, quantity: number, specialInstructions?: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.menuItem.id === menuItem.id && 
        item.specialInstructions === specialInstructions
      );

      if (existingItem) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id && item.specialInstructions === specialInstructions
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { menuItem, quantity, specialInstructions }];
    });
  }, []);

  const removeFromCart = useCallback((menuItemId: string, specialInstructions?: string) => {
    setCartItems(prev => 
      prev.filter(item => 
        !(item.menuItem.id === menuItemId && item.specialInstructions === specialInstructions)
      )
    );
  }, []);

  const updateQuantity = useCallback((menuItemId: string, newQuantity: number, specialInstructions?: string) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId, specialInstructions);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId && item.specialInstructions === specialInstructions
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  }, [cartItems]);

  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const value: CartContextType = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    openCart,
    closeCart,
    toggleCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 