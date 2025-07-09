// Types pour l'application Uber Eats

// Types de rôles utilisateur
// Enums pour les statuts et rôles
export enum UserRole {
  USER = 'user',
  DELIVERY = 'delivery',
  RESTAURANT = 'restaurant'
}

// Enum unifié pour tous les statuts de commandes et livraisons
export enum UnifiedOrderStatus {
  // Étapes initiales
  PENDING = 'pending',        // En attente de confirmation restaurant
  
  // Étapes restaurant
  CONFIRMED = 'confirmed',    // Confirmée par le restaurant
  PREPARING = 'preparing',    // En cours de préparation
  READY = 'ready',           // Prête pour récupération
  
  // Étapes livraison
  ON_THE_WAY = 'on-the-way',  // En cours de livraison
  
  // Étapes finales
  DELIVERED = 'delivered',    // Livrée au client
  
  // Étapes d'échec
  CANCELLED = 'cancelled',    // Annulée
  FAILED = 'failed',          // Échec de livraison
}

// Alias de types pour la rétrocompatibilité - seront supprimés progressivement
export type OrderStatus = UnifiedOrderStatus;
export type DeliveryStatus = UnifiedOrderStatus;
export type LivraisonStatus = UnifiedOrderStatus;
export type RestaurantOrderStatus = UnifiedOrderStatus;

export enum RestaurantPermission {
  VIEW_ORDERS = 'view_orders',
  MANAGE_ORDERS = 'manage_orders',
  MANAGE_MENU = 'manage_menu',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_RESTAURANT_INFO = 'manage_restaurant_info'
}

export enum CuisineType {
  FRENCH = 'french',
  ITALIAN = 'italian',
  JAPANESE = 'japanese',
  CHINESE = 'chinese',
  INDIAN = 'indian',
  MEXICAN = 'mexican',
  AMERICAN = 'american',
  MEDITERRANEAN = 'mediterranean',
  THAI = 'thai',
  VIETNAMESE = 'vietnamese'
}

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

// Les types sont maintenant définis comme des enums au début du fichier

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
  role?: UserRole;       // Changé pour utiliser le type UserRole
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
  role: UserRole;       // Changé pour utiliser le type UserRole
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
  role?: UserRole;
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

// Types pour l'API de livraisons

export interface Livreur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  isAvailable: boolean;
  vehicleType?: string;
  zone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Livraison {
  id: string;
  orderId?: string;
  restaurantId?: string;
  customerId?: string;
  livreurId?: string;
  status?: LivraisonStatus;
  pickupAddress?: string;
  deliveryAddress?: string;
  customerName?: string;
  customerPhone?: string;
  restaurantName: string;
  totalAmount: number;
  estimatedTime?: number;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// LivraisonStatus maintenant défini comme enum au début du fichier

// Types pour les statistiques livreur
export interface LivreurStats {
  todayDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  completionRate: number;
  totalDeliveries: number;
}

// Types pour les requêtes API
export interface CreateLivreurRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  vehicleType?: string;
  zone?: string;
}

export interface UpdateLivreurRequest extends Partial<CreateLivreurRequest> {
  isAvailable?: boolean;
}

export interface CreateLivraisonRequest {
  orderId: string;
  restaurantId: string;
  customerId: string;
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  restaurantName: string;
  totalAmount: number;
  estimatedTime?: number;
  notes?: string;
}

export interface UpdateLivraisonStatusRequest {
  status: LivraisonStatus;
  notes?: string;
}

// Types pour les commandes basés sur le modèle C#
export interface LigneCommande {
  produitId: string;
  quantite: number;
  prixUnitaire: number; // En centimes pour éviter les problèmes de précision
}

export interface Commande {
  id: string; // Guid en string
  clientId: string;
  restaurantId: string;
  dateCréation: string; // ISO date string
  produits: LigneCommande[];
  prixTotal: number; // En centimes
  statut: string; // Statut libre comme dans le modèle C#
}

// CommandeStatus maintenant défini comme enum au début du fichier

export interface CreateCommandeRequest {
  clientId: string;
  restaurantId: string;
  produits: LigneCommande[];
  prixTotal: number;
  statut?: string;
}

export interface UpdateCommandeRequest {
  clientId?: string;
  restaurantId?: string;
  dateCréation?: string;
  produits?: LigneCommande[];
  prixTotal?: number;
  statut?: string;
}

// Types pour la création de commande avec détails du panier
export interface OrderDetails {
  id?: string;
  clientId: string;
  restaurantId: string;
  cartItems: CartItem[];
  totalPrice: number; // En euros (sera converti en centimes)
  deliveryAddress?: Address;
  paymentMethod?: 'card' | 'cash';
  status: string;
  createdAt: string;
  estimatedDeliveryTime?: number;
}

// Interface pour les détails complets d'une commande récupérée
export interface CommandeDetails extends Commande {
  parsedCartItems: CartItem[]; // CartItems reconstitués depuis LigneCommande
  totalPriceEuros: number; // Prix en euros pour l'affichage
  deliveryAddress?: Address;
}

// Types spécifiques pour les restaurateurs
export interface RestaurantOwner {
  id: string;
  userId: string; // Référence vers l'utilisateur
  restaurantId: string; // Restaurant géré
  permissions: RestaurantPermission[];
  created_at?: string;
  updated_at?: string;
}

// RestaurantPermission et RestaurantOrderStatus maintenant définis comme enums au début du fichier 