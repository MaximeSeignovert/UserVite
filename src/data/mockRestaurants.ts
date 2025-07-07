import type { Restaurant } from '../types/index';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Le Petit Bistro',
    description: 'Cuisine française authentique avec des plats traditionnels',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 2.50,
    cuisine: ['french'],
    isOpen: true,
    promo: '20% de réduction sur votre première commande'
  },
  {
    id: '2',
    name: 'Pizza Roma',
    description: 'Pizzas italiennes artisanales au feu de bois',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700',
    rating: 4.7,
    deliveryTime: '20-30 min',
    deliveryFee: 1.90,
    cuisine: ['italian'],
    isOpen: true
  },
  {
    id: '3',
    name: 'Sushi Zen',
    description: 'Sushis frais et cuisine japonaise raffinée',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=700',
    rating: 4.8,
    deliveryTime: '30-40 min',
    deliveryFee: 3.00,
    cuisine: ['japanese'],
    isOpen: true
  },
  {
    id: '4',
    name: 'Burger Street',
    description: 'Burgers gourmets et frites maison',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700',
    rating: 4.2,
    deliveryTime: '15-25 min',
    deliveryFee: 2.00,
    cuisine: ['american'],
    isOpen: true
  },
  {
    id: '5',
    name: 'Taj Mahal',
    description: 'Spécialités indiennes épicées et authentiques',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700',
    rating: 4.6,
    deliveryTime: '35-45 min',
    deliveryFee: 2.80,
    cuisine: ['indian'],
    isOpen: false
  },
  {
    id: '6',
    name: 'Green Garden',
    description: 'Cuisine végétarienne et végan, bowls healthy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700',
    rating: 4.4,
    deliveryTime: '20-30 min',
    deliveryFee: 2.20,
    cuisine: ['mediterranean'],
    isOpen: true,
    promo: 'Livraison gratuite'
  },
  {
    id: '7',
    name: 'Dragon Wok',
    description: 'Cuisine chinoise traditionnelle et moderne',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=700',
    rating: 4.3,
    deliveryTime: '25-35 min',
    deliveryFee: 2.50,
    cuisine: ['chinese'],
    isOpen: true
  },
  {
    id: '8',
    name: 'Tacos Loco',
    description: 'Cuisine mexicaine authentique et épicée',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1171',
    rating: 4.1,
    deliveryTime: '20-30 min',
    deliveryFee: 2.20,
    cuisine: ['mexican'],
    isOpen: true,
    promo: 'Menu étudiant à 12€'
  }
]; 