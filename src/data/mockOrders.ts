import type { Order, OrderItem } from '../types/index';

export const mockOrderItems: OrderItem[] = [
  // Items pour la commande 1
  {
    menuItemId: '1-1', // Coq au Vin
    quantity: 1,
    unitPrice: 18.50
  },
  {
    menuItemId: '1-3', // Crème Brûlée
    quantity: 2,
    unitPrice: 7.50
  },
  // Items pour la commande 2
  {
    menuItemId: '2-1', // Pizza Margherita
    quantity: 2,
    unitPrice: 14.00
  },
  {
    menuItemId: '2-3', // Tiramisu
    quantity: 1,
    unitPrice: 6.50
  },
  // Items pour la commande 3
  {
    menuItemId: '3-1', // Plateau Sashimi
    quantity: 1,
    unitPrice: 24.00
  },
  {
    menuItemId: '3-2', // Maki California
    quantity: 2,
    unitPrice: 8.50
  },
  // Items pour la commande 4
  {
    menuItemId: '4-1', // Classic Burger
    quantity: 1,
    unitPrice: 12.50
  },
  {
    menuItemId: '4-3', // Frites Maison
    quantity: 1,
    unitPrice: 4.50
  },
  // Items pour la commande 5
  {
    menuItemId: '6-1', // Buddha Bowl
    quantity: 1,
    unitPrice: 13.50
  },
  {
    menuItemId: '6-3', // Smoothie Bowl
    quantity: 1,
    unitPrice: 8.50
  }
];

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    restaurantId: '1',
    items: [mockOrderItems[0], mockOrderItems[1]], // Coq au Vin + 2 Crème Brûlée
    totalPrice: 33.50, // 18.50 + (2 * 7.50)
    status: 'delivered',
    createdAt: new Date('2024-01-15T12:30:00Z')
  },
  {
    id: 'order-2',
    userId: 'user-2',
    restaurantId: '2',
    items: [mockOrderItems[2], mockOrderItems[3]], // 2 Pizza Margherita + Tiramisu
    totalPrice: 34.50, // (2 * 14.00) + 6.50
    status: 'on-the-way',
    createdAt: new Date('2024-01-15T19:45:00Z')
  },
  {
    id: 'order-3',
    userId: 'user-1',
    restaurantId: '3',
    items: [mockOrderItems[4], mockOrderItems[5]], // Plateau Sashimi + 2 Maki California
    totalPrice: 41.00, // 24.00 + (2 * 8.50)
    status: 'preparing',
    createdAt: new Date('2024-01-15T20:15:00Z')
  },
  {
    id: 'order-4',
    userId: 'user-3',
    restaurantId: '4',
    items: [mockOrderItems[6], mockOrderItems[7]], // Classic Burger + Frites
    totalPrice: 17.00, // 12.50 + 4.50
    status: 'confirmed',
    createdAt: new Date('2024-01-15T18:20:00Z')
  },
  {
    id: 'order-5',
    userId: 'user-2',
    restaurantId: '6',
    items: [mockOrderItems[8], mockOrderItems[9]], // Buddha Bowl + Smoothie Bowl
    totalPrice: 22.00, // 13.50 + 8.50
    status: 'placed',
    createdAt: new Date('2024-01-15T21:00:00Z')
  },
  {
    id: 'order-6',
    userId: 'user-4',
    restaurantId: '8',
    items: [
      {
        menuItemId: '8-1', // Tacos Carnitas
        quantity: 3,
        unitPrice: 9.50
      },
      {
        menuItemId: '8-3', // Guacamole
        quantity: 1,
        unitPrice: 5.50
      }
    ],
    totalPrice: 34.00, // (3 * 9.50) + 5.50
    status: 'cancelled',
    createdAt: new Date('2024-01-14T16:30:00Z')
  }
]; 