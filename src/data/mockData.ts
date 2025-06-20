import type { Restaurant, MenuItem, User } from '../types/index';

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
  }
];

export const mockMenuItems: { [restaurantId: string]: MenuItem[] } = {
  '1': [ // Le Petit Bistro
    {
      id: '1-1',
      name: 'Coq au Vin',
      description: 'Coq mijoté au vin rouge avec légumes de saison',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300',
      category: 'Plats principaux',
      isPopular: true
    },
    {
      id: '1-2',
      name: 'Escargots de Bourgogne',
      description: '6 escargots au beurre persillé',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1715249792894-43ad23412d3d?q=80&w=300',
      category: 'Entrées'
    },
    {
      id: '1-3',
      name: 'Crème Brûlée',
      description: 'Dessert traditionnel français à la vanille',
      price: 7.50,
      image: 'https://images.unsplash.com/photo-1615235739538-95040f341ba8?q=80&w=300',
      category: 'Desserts'
    }
  ],
  '2': [ // Pizza Roma
    {
      id: '2-1',
      name: 'Pizza Margherita',
      description: 'Tomate, mozzarella, basilic frais',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
      category: 'Pizzas',
      isPopular: true,
      isVegetarian: true
    },
    {
      id: '2-2',
      name: 'Pizza Quattro Stagioni',
      description: 'Tomate, mozzarella, jambon, champignons, artichauts, olives',
      price: 17.50,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=300',
      category: 'Pizzas'
    },
    {
      id: '2-3',
      name: 'Tiramisu',
      description: 'Dessert italien au café et mascarpone',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300',
      category: 'Desserts',
      isVegetarian: true
    }
  ],
  '3': [ // Sushi Zen
    {
      id: '3-1',
      name: 'Plateau Sashimi',
      description: '12 pièces de poissons frais variés',
      price: 24.00,
      image: 'https://images.unsplash.com/photo-1712183718506-41a054650697?q=80&w=300',
      category: 'Sashimi',
      isPopular: true
    },
    {
      id: '3-2',
      name: 'Maki California',
      description: '8 pièces - Avocat, concombre, surimi',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
      category: 'Maki'
    },
    {
      id: '3-3',
      name: 'Chirashi Saumon',
      description: 'Bol de riz avec saumon frais et légumes',
      price: 16.00,
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=300',
      category: 'Chirashi'
    }
  ],
  '4': [ // Burger Street
    {
      id: '4-1',
      name: 'Classic Burger',
      description: 'Steak haché, cheddar, salade, tomate, oignons',
      price: 12.50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      category: 'Burgers',
      isPopular: true
    },
    {
      id: '4-2',
      name: 'Veggie Burger',
      description: 'Steak végétal, avocat, salade, tomate',
      price: 11.00,
      image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=300',
      category: 'Burgers',
      isVegetarian: true,
      isVegan: true
    },
    {
      id: '4-3',
      name: 'Frites Maison',
      description: 'Frites fraîches coupées à la main',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300',
      category: 'Accompagnements',
      isVegetarian: true
    }
  ]
};

export const mockUser: User = {
  id: 'user-1',
  name: 'Marie Dupont',
  email: 'marie.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  addresses: [
    {
      id: 'addr-1',
      street: '123 Rue de la République',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    {
      id: 'addr-2',
      street: '45 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France'
    }
  ],
  favoriteRestaurants: ['1', '3']
}; 