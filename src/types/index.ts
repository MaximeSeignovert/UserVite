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

// Nouveau type OrderItem basé sur le diagramme de classes
export interface OrderItem {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
}

// Type Order mis à jour selon le diagramme de classes
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
}

// Nouveau type Delivery selon le diagramme de classes
export interface Delivery {
  id: string;
  orderId: string;
  deliveryPersonId: string;
  deliveryAddressId: string;
  dispatchedAt?: Date;
  deliveredAt?: Date;
  status: DeliveryStatus;
}

// Nouveau type DeliveryPerson selon le diagramme de classes
export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
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
  profilePicture: string;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'on-the-way'
  | 'delivered'
  | 'cancelled';

export type DeliveryStatus =
  | 'pending'
  | 'dispatched'
  | 'on-the-way'
  | 'delivered'
  | 'failed';

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

// Types pour l'authentification Flask
export interface LoginCredentials {
  username: string;  // Flask utilise username au lieu d'email
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;  // Ajouté username pour correspondre à l'API Flask
  email: string;
  firstname?: string;  // Ajouté pour correspondre aux nouveaux champs
  lastname?: string;   // Ajouté pour correspondre aux nouveaux champs
  role?: string;       // Ajouté pour correspondre au rôle utilisateur
  phone?: string;
  addresses: Address[];
  favoriteRestaurants: string[];
  profilePicture: string;
  created_at?: string;  // Ajouté pour correspondre à la réponse profile de Flask
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (userData: Partial<AuthUser>) => Promise<void>;
}

export interface RegisterData {
  username: string;  // Changé de name à username pour Flask
  email: string;
  password: string;
  firstname: string;  // Nouveau champ requis par l'API
  lastname: string;   // Nouveau champ requis par l'API
  role: string;       // Nouveau champ requis par l'API (user ou delivery)
  phone?: string;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  username: string;  // Changé de name à username pour Flask
  iat: number;
  exp: number;
}

// Types pour les API responses
// Réponse Flask pour le login
export interface LoginResponse {
  access_token: string;  // Flask retourne access_token
}

// Réponse Flask pour le profil
export interface ProfileResponse {
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  created_at?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 