import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ShoppingBag } from 'lucide-react';
import type { Commande } from '../../types/index';

interface OrderDetailsProps {
  order: Commande;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2) + ' €';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Détails de la Commande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Articles commandés:</h4>
          <div className="space-y-2">
            {order.produits.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">
                  {item.quantite}x Produit {item.produitId}
                </span>
                <span className="font-medium">
                  {formatPrice(item.prixUnitaire * item.quantite)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold text-green-600">
              {formatPrice(order.prixTotal)}
            </span>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nombre d'articles:</span>
            <span className="font-medium">
              {order.produits.reduce((total, item) => total + item.quantite, 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Prix moyen par article:</span>
            <span className="font-medium">
              {formatPrice(
                order.prixTotal / order.produits.reduce((total, item) => total + item.quantite, 0)
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 