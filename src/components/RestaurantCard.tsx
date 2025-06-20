import type { Restaurant } from '../types';
import { Star, Clock, Truck } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative px-4">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        {restaurant.promo && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            {restaurant.promo}
          </Badge>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center mx-4 rounded-lg">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Fermé
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{restaurant.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{restaurant.description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
            <span>{restaurant.deliveryFee === 0 ? 'Gratuit' : `${restaurant.deliveryFee.toFixed(2)}€`}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {restaurant.cuisine.map((cuisine) => (
            <Badge key={cuisine} variant="outline" className="text-xs">
              {cuisine}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 