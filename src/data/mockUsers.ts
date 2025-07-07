import type { User, Address } from '../types/index';

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    street: '123 Rue de la République',
    city: 'Paris',
    postalCode: '75001',
    country: 'France'
  },
  {
    id: 'addr-2',
    street: '45 Avenue des Champs-Élysées',
    city: 'Paris',
    postalCode: '75008',
    country: 'France'
  },
  {
    id: 'addr-3',
    street: '78 Boulevard Saint-Germain',
    city: 'Paris',
    postalCode: '75006',
    country: 'France'
  },
  {
    id: 'addr-4',
    street: '32 Rue du Faubourg Saint-Antoine',
    city: 'Paris',
    postalCode: '75012',
    country: 'France'
  },
  {
    id: 'addr-5',
    street: '156 Avenue de la République',
    city: 'Lyon',
    postalCode: '69003',
    country: 'France'
  },
  {
    id: 'addr-6',
    street: '89 Cours Mirabeau',
    city: 'Aix-en-Provence',
    postalCode: '13100',
    country: 'France'
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    addresses: [mockAddresses[0], mockAddresses[1]],
    favoriteRestaurants: ['1', '3'],
    profilePicture: 'https://this-person-does-not-exist.com/img/avatar-gen80dbce377f363e3ff60fa48973d956a4.jpg'
  },
  {
    id: 'user-2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    phone: '+33 6 87 65 43 21',
    addresses: [mockAddresses[2]],
    favoriteRestaurants: ['2', '4', '6'],
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
  },
  {
    id: 'user-3',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    phone: '+33 6 98 76 54 32',
    addresses: [mockAddresses[3], mockAddresses[4]],
    favoriteRestaurants: ['5', '7'],
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces'
  },
  {
    id: 'user-4',
    name: 'Lucas Moreau',
    email: 'lucas.moreau@email.com',
    phone: '+33 6 45 67 89 01',
    addresses: [mockAddresses[5]],
    favoriteRestaurants: ['8', '1', '2'],
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces'
  }
];

// Export pour compatibilité avec l'ancien format
export const mockUser = mockUsers[0]; 