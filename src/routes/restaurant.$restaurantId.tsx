import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { MenuItemCard } from '../components/MenuItemCard';
import { useCart } from '../providers/CartProvider';
import { useDialog } from '../providers/DialogProvider';
import { useSearch } from '../providers/SearchProvider';
import { useRestaurants } from '../hooks/useRestaurants';
import { useMenuItems } from '../hooks/useMenuItems';
import { Star, Clock, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import type { MenuItem, Restaurant } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function RestaurantPage() {
  const { restaurantId } = Route.useParams();
  const navigate = Route.useNavigate();
  const { searchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { restaurants, loading: restaurantsLoading, error: restaurantsError } = useRestaurants();
  const { menuItems, loading: menuLoading, error: menuError } = useMenuItems(restaurantId);

  const restaurant = restaurants.find(r => r.id === restaurantId);

  // Gestion des états de chargement
  if (restaurantsLoading || menuLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du restaurant et du menu...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (restaurantsError || menuError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">
          Erreur: {restaurantsError || menuError}
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  if (!restaurant) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant non trouvé</h1>
            <Button onClick={() => navigate({ to: '/' })}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <RestaurantContent 
        restaurant={restaurant}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        filteredItems={filteredItems}
        onNavigateBack={() => navigate({ to: '/' })}
        searchQuery={searchQuery}
      />
  );
}

interface RestaurantContentProps {
  restaurant: Restaurant;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filteredItems: MenuItem[];
  onNavigateBack: () => void;
  searchQuery: string;
}

function RestaurantContent({ 
  restaurant, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  filteredItems,
  onNavigateBack,
  searchQuery
}: RestaurantContentProps) {
  const { addToCart } = useCart();
  const { openAddToCartDialog } = useDialog();

  return (
    <>
      {/* Bouton retour */}
      <Button
        variant="ghost"
        onClick={onNavigateBack}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux restaurants
      </Button>

      {/* En-tête du restaurant */}
      <Card className="overflow-hidden mb-6">
        <CardHeader className="p-0 rounded-lg w-full h-64 px-4">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </CardHeader>
        
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>{restaurant.deliveryFee === 0 ? 'Livraison gratuite' : `${restaurant.deliveryFee.toFixed(2)}€ de livraison`}</span>
            </div>
          </div>

          {restaurant.promo && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{restaurant.promo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
          >
            {category === 'all' ? 'Tout' : category}
          </Button>
        ))}
      </div>

      {/* Menu items */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((menuItem) => (
            <MenuItemCard
              key={menuItem.id}
              menuItem={menuItem}
              onAddToCart={addToCart}
              onOpenDialog={openAddToCartDialog}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun plat trouvé{searchQuery && ` pour "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export const Route = createFileRoute('/restaurant/$restaurantId')({
  component: RestaurantPage,
}); 