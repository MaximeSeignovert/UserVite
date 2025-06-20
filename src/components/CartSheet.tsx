import type { CartItem } from '../types';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';

interface CartSheetProps {
  cartItems: CartItem[];
  onUpdateQuantity: (menuItemId: string, newQuantity: number, specialInstructions?: string) => void;
  onRemoveItem: (menuItemId: string, specialInstructions?: string) => void;
  onCheckout: () => void;
  deliveryFee: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CartSheet = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  deliveryFee,
  isOpen,
  onClose
}: CartSheetProps) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  const taxes = subtotal * 0.1; // TVA de 10%
  const total = subtotal + deliveryFee + taxes;
  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Votre commande
            {totalItems > 0 && (
              <Badge variant="secondary">
                {totalItems} article{totalItems > 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Votre panier est vide
            </h3>
            <p className="text-muted-foreground">
              Ajoutez des plats pour commencer votre commande
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Liste des articles */}
            <div className="flex-1 px-2 space-y-4 overflow-y-auto mb-4">
              {cartItems.map((item, index) => (
                <div 
                  key={`${item.menuItem.id}-${item.specialInstructions || ''}-${index}`} 
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <img 
                    src={item.menuItem.image} 
                    alt={item.menuItem.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{item.menuItem.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.menuItem.price.toFixed(2)}€
                    </p>
                    {item.specialInstructions && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Note: {item.specialInstructions}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1, item.specialInstructions)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <Badge variant="secondary" className="w-8 text-center">
                      {item.quantity}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1, item.specialInstructions)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.menuItem.id, item.specialInstructions)}
                    className="text-destructive hover:text-destructive w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Résumé de la commande */}
            <div className="border-t px-4 pb-2 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span>{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toFixed(2)}€`}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>TVA</span>
                <span>{taxes.toFixed(2)}€</span>
              </div>
              
              <div className="flex justify-between font-semibold text-lg border-t pt-3">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              
              <Button 
                onClick={onCheckout}
                className="w-full"
                size="lg"
              >
                Commander ({total.toFixed(2)}€)
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}; 