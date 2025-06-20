import { useState } from 'react';
import type { MenuItem } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Minus, Plus, Leaf, Heart } from 'lucide-react';

interface AddToCartDialogProps {
  menuItem: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void;
}

export const AddToCartDialog = ({ menuItem, isOpen, onClose, onAddToCart }: AddToCartDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleClose = () => {
    setQuantity(1);
    setSpecialInstructions('');
    onClose();
  };

  const handleAddToCart = () => {
    if (menuItem) {
      onAddToCart(menuItem, quantity, specialInstructions || undefined);
      handleClose();
    }
  };

  if (!menuItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter au panier</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image et informations du plat */}
          <div className="flex gap-4">
            <img 
              src={menuItem.image} 
              alt={menuItem.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{menuItem.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {menuItem.description}
              </p>
              <div className="flex gap-1 flex-wrap">
                {menuItem.isPopular && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                )}
                {menuItem.isVegetarian && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                    <Leaf className="w-3 h-3 mr-1" />
                    Végé
                  </Badge>
                )}
                {menuItem.isVegan && (
                  <Badge className="bg-green-600 hover:bg-green-700 text-xs">
                    Végan
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Sélection de la quantité */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              
              <Badge variant="secondary" className="w-12 text-center py-2">
                {quantity}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Instructions spéciales */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions spéciales (optionnel)</Label>
            <Input
              id="instructions"
              placeholder="Ex: Pas d'oignons, sauce à part..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          {/* Allergènes */}
          {menuItem.allergens && menuItem.allergens.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-1">
                ⚠️ Allergènes
              </p>
              <p className="text-xs text-yellow-700">
                {menuItem.allergens.join(', ')}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">
            {(menuItem.price * quantity).toFixed(2)}€
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button onClick={handleAddToCart}>
              Ajouter au panier
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 