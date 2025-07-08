// Ce fichier maintient la rétrocompatibilité en réexportant depuis les nouveaux fichiers séparés
// Importation depuis les nouveaux fichiers organisés
export {
  mockRestaurants,
  mockMenuItems,
  mockUsers,
  mockUser,
  mockAddresses,
  mockOrders,
  mockOrderItems,
  mockDeliveries,
  mockDeliveryPersons,
  getRestaurantById,
  getMenuItemsByRestaurantId,
  getUserById,
  getAddressById,
  getOrdersByUserId,
  getOrderById,
  getDeliveryByOrderId,
  getDeliveryPersonById
} from './index';

// Réexport des types pour faciliter l'importation
export type {
  Restaurant,
  MenuItem,
  User,
  Address,
  Order,
  OrderItem,
  Delivery,
  DeliveryPerson,
  OrderStatus,
  UnifiedOrderStatus,
  CartItem
} from '../types/index'; 