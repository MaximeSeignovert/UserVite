import type { MenuItem } from '../types/index';

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
    },
    {
      id: '1-4',
      name: 'Boeuf Bourguignon',
      description: 'Boeuf braisé aux légumes et vin rouge',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300',
      category: 'Plats principaux'
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
    },
    {
      id: '2-4',
      name: 'Pizza Diavola',
      description: 'Tomate, mozzarella, salami piquant',
      price: 15.50,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
      category: 'Pizzas',
      isPopular: true
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
    },
    {
      id: '3-4',
      name: 'Nigiri Thon',
      description: '6 pièces de thon rouge sur riz vinaigré',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300',
      category: 'Nigiri'
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
    },
    {
      id: '4-4',
      name: 'Bacon Burger',
      description: 'Double steak, bacon croustillant, cheddar',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300',
      category: 'Burgers'
    }
  ],
  '5': [ // Taj Mahal
    {
      id: '5-1',
      name: 'Chicken Tikka Masala',
      description: 'Poulet mariné dans une sauce crémeuse aux épices',
      price: 16.50,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300',
      category: 'Plats principaux',
      isPopular: true
    },
    {
      id: '5-2',
      name: 'Naan au fromage',
      description: 'Pain indien traditionnel fourré au fromage',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300',
      category: 'Accompagnements',
      isVegetarian: true
    },
    {
      id: '5-3',
      name: 'Biryani aux légumes',
      description: 'Riz basmati aux épices et légumes variés',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d71a?w=300',
      category: 'Plats principaux',
      isVegetarian: true
    }
  ],
  '6': [ // Green Garden
    {
      id: '6-1',
      name: 'Buddha Bowl',
      description: 'Quinoa, avocat, légumes grillés, graines',
      price: 13.50,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
      category: 'Bowls',
      isPopular: true,
      isVegetarian: true,
      isVegan: true
    },
    {
      id: '6-2',
      name: 'Salade César Végé',
      description: 'Salade verte, croûtons, parmesan végétal',
      price: 11.00,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
      category: 'Salades',
      isVegetarian: true
    },
    {
      id: '6-3',
      name: 'Smoothie Bowl',
      description: 'Fruits mixés, granola, fruits frais',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=300',
      category: 'Desserts',
      isVegetarian: true,
      isVegan: true
    }
  ],
  '7': [ // Dragon Wok
    {
      id: '7-1',
      name: 'Canard laqué',
      description: 'Canard traditionnel aux épices chinoises',
      price: 19.50,
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300',
      category: 'Plats principaux',
      isPopular: true
    },
    {
      id: '7-2',
      name: 'Nouilles sautées',
      description: 'Nouilles chinoises aux légumes et sauce soja',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300',
      category: 'Nouilles',
      isVegetarian: true
    },
    {
      id: '7-3',
      name: 'Beignets de crevettes',
      description: 'Crevettes panées à la sauce aigre-douce',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
      category: 'Entrées'
    }
  ],
  '8': [ // Tacos Loco
    {
      id: '8-1',
      name: 'Tacos Carnitas',
      description: 'Porc effiloché, oignons, coriandre',
      price: 9.50,
      image: 'https://images.unsplash.com/photo-1565299585323-38174c13a6e9?w=300',
      category: 'Tacos',
      isPopular: true
    },
    {
      id: '8-2',
      name: 'Quesadilla',
      description: 'Tortilla fourrée au fromage et poulet',
      price: 11.00,
      image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300',
      category: 'Spécialités'
    },
    {
      id: '8-3',
      name: 'Guacamole',
      description: 'Avocat écrasé aux épices mexicaines',
      price: 5.50,
      image: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=300',
      category: 'Accompagnements',
      isVegetarian: true,
      isVegan: true
    }
  ]
}; 