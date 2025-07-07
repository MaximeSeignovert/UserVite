import type { Delivery, DeliveryPerson } from '../types/index';

export const mockDeliveryPersons: DeliveryPerson[] = [
  {
    id: 'delivery-1',
    name: 'Ahmed Ben Ali',
    phone: '+33 6 11 22 33 44',
    isAvailable: true
  },
  {
    id: 'delivery-2',
    name: 'Julie Lefevre',
    phone: '+33 6 55 66 77 88',
    isAvailable: false
  },
  {
    id: 'delivery-3',
    name: 'Marco Silva',
    phone: '+33 6 99 88 77 66',
    isAvailable: true
  },
  {
    id: 'delivery-4',
    name: 'Sarah Johnson',
    phone: '+33 6 44 33 22 11',
    isAvailable: true
  },
  {
    id: 'delivery-5',
    name: 'David Chen',
    phone: '+33 6 77 88 99 00',
    isAvailable: false
  }
];

export const mockDeliveries: Delivery[] = [
  {
    id: 'delivery-order-1',
    orderId: 'order-1',
    deliveryPersonId: 'delivery-2',
    deliveryAddressId: 'addr-1',
    dispatchedAt: new Date('2024-01-15T13:00:00Z'),
    deliveredAt: new Date('2024-01-15T13:25:00Z'),
    status: 'delivered'
  },
  {
    id: 'delivery-order-2',
    orderId: 'order-2',
    deliveryPersonId: 'delivery-1',
    deliveryAddressId: 'addr-3',
    dispatchedAt: new Date('2024-01-15T20:10:00Z'),
    status: 'on-the-way'
  },
  {
    id: 'delivery-order-3',
    orderId: 'order-3',
    deliveryPersonId: 'delivery-3',
    deliveryAddressId: 'addr-2',
    status: 'pending'
  },
  {
    id: 'delivery-order-4',
    orderId: 'order-4',
    deliveryPersonId: 'delivery-4',
    deliveryAddressId: 'addr-4',
    dispatchedAt: new Date('2024-01-15T18:45:00Z'),
    status: 'dispatched'
  },
  {
    id: 'delivery-order-5',
    orderId: 'order-5',
    deliveryPersonId: 'delivery-1',
    deliveryAddressId: 'addr-3',
    status: 'pending'
  }
]; 