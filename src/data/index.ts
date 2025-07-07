import { mockDeliveries, mockDeliveryPersons } from './mockDeliveries';
import { mockMenuItems } from './mockMenuItems';
import { mockOrders } from './mockOrders';
import { mockRestaurants } from './mockRestaurants';
import { mockAddresses, mockUsers } from './mockUsers';

// Export des restaurants
export { mockRestaurants } from './mockRestaurants';

// Export des menus par restaurant
export { mockMenuItems } from './mockMenuItems';

// Export des utilisateurs et adresses
export { mockUsers, mockUser, mockAddresses } from './mockUsers';

// Export des commandes et items de commande
export { mockOrders, mockOrderItems } from './mockOrders';

// Export des livraisons et livreurs
export { mockDeliveries, mockDeliveryPersons } from './mockDeliveries';

// Fonction utilitaire pour obtenir un restaurant par ID
export const getRestaurantById = (id: string) => {
  return mockRestaurants.find(restaurant => restaurant.id === id);
};

// Fonction utilitaire pour obtenir les items de menu d'un restaurant
export const getMenuItemsByRestaurantId = (restaurantId: string) => {
  return mockMenuItems[restaurantId] || [];
};

// Fonction utilitaire pour obtenir un utilisateur par ID
export const getUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

// Fonction utilitaire pour obtenir une adresse par ID
export const getAddressById = (id: string) => {
  return mockAddresses.find(address => address.id === id);
};

// Fonction utilitaire pour obtenir les commandes d'un utilisateur
export const getOrdersByUserId = (userId: string) => {
  return mockOrders.filter(order => order.userId === userId);
};

// Fonction utilitaire pour obtenir une commande par ID
export const getOrderById = (id: string) => {
  return mockOrders.find(order => order.id === id);
};

// Fonction utilitaire pour obtenir la livraison d'une commande
export const getDeliveryByOrderId = (orderId: string) => {
  return mockDeliveries.find(delivery => delivery.orderId === orderId);
};

// Fonction utilitaire pour obtenir un livreur par ID
export const getDeliveryPersonById = (id: string) => {
  return mockDeliveryPersons.find(person => person.id === id);
}; 