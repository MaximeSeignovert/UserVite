import type { MenuItem } from '../types';
import { Plus, Leaf, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface MenuItemCardProps {
  menuItem: MenuItem;
  onAddToCart: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void;
  onOpenDialog: (menuItem: MenuItem) => void;
}

export const MenuItemCard = ({ menuItem, onAddToCart, onOpenDialog }: MenuItemCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold">{menuItem.name}</h3>
            <div className="flex gap-1 ml-2 flex-wrap">
              {menuItem.isPopular && (
                <Badge className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  Populaire
                </Badge>
              )}
              {menuItem.isVegetarian && (
                <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  Végé
                </Badge>
              )}
              {menuItem.isVegan && (
                <Badge className="bg-green-600 hover:bg-green-700">
                  Végan
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {menuItem.description}
          </p>
          
          {menuItem.allergens && menuItem.allergens.length > 0 && (
            <p className="text-xs text-muted-foreground mb-2">
              Allergènes: {menuItem.allergens.join(', ')}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              {menuItem.price.toFixed(2)}€
            </span>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => onAddToCart(menuItem, 1)}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Rapide
              </Button>
              <Button 
                onClick={() => onOpenDialog(menuItem)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Personnaliser
              </Button>
            </div>
          </div>
        </CardContent>
        
        <div className="w-24 h-24 m-4">
          <img 
            src={menuItem.image} 
            alt={menuItem.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </Card>
  );
}; 