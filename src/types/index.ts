// Types pour l'application Uber Eats

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: string[];
  isOpen: boolean;
  promo?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  estimatedDeliveryTime: string;
  deliveryAddress: Address;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  favoriteRestaurants: string[];
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'on-the-way'
  | 'delivered'
  | 'cancelled';

export type CuisineType = 
  | 'french'
  | 'italian'
  | 'japanese'
  | 'chinese'
  | 'indian'
  | 'mexican'
  | 'american'
  | 'mediterranean'
  | 'thai'
  | 'vietnamese';

export interface SearchFilters {
  cuisineType?: CuisineType;
  minRating?: number;
  maxDeliveryTime?: number;
  isVegetarian?: boolean;
}

// Types pour l'API adresse française
export interface AddressApiResponse {
  type: string;
  version: string;
  features: AddressFeature[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
}

export interface AddressFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id: string;
    type: 'housenumber' | 'street' | 'locality' | 'municipality';
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string;
    importance: number;
    street?: string;
  };
} 