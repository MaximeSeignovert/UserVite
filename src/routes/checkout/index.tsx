import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useCart } from '../../providers/CartProvider';
import { useDialog } from '../../providers/DialogProvider';
import { useOrder } from '../../hooks/useOrder';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { 
  MapPin, 
  CreditCard, 
  Clock, 
  ShoppingBag, 
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Euro
} from 'lucide-react';
import { UnifiedOrderStatus } from '@/types';

export const Route = createFileRoute('/checkout/')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, updateQuantity, clearCart } = useCart();
  const { selectedAddress } = useDialog();
  const { createOrder, loading: orderLoading, error: orderError, clearError } = useOrder();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subtotal = getCartTotal();
  const deliveryFee = 3.90;
  const taxes = subtotal * 0.1; // 10% de taxes
  const total = subtotal + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      return;
    }

    setIsProcessing(true);
    clearError();
    
    try {
      // Créer la commande via l'API
      const orderDetails = {
        clientId: '', // Sera rempli automatiquement par le hook
        restaurantId: 'restaurant-demo-id', // ID du restaurant (à récupérer dynamiquement)
        cartItems,
        totalPrice: total,
        deliveryAddress: selectedAddress,
        paymentMethod,
        status: UnifiedOrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: 35
      };

      const newOrder = await createOrder(orderDetails);
      
      if (newOrder) {
        // Vider le panier
        clearCart();
        
        // Rediriger vers la page de suivi avec l'ID réel de la commande
        navigate({ 
          to: '/order-tracking/$orderId', 
          params: { orderId: newOrder.id },
          search: { 
            total: total.toFixed(2),
            restaurant: 'Restaurant Demo'
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-6">
                Ajoutez des plats à votre panier pour continuer
              </p>
              <Button onClick={() => navigate({ to: '/' })}>
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Finaliser la commande</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Adresse de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAddress ? (
                  <div className="space-y-2">
                    <p className="font-medium">{selectedAddress.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress.city}, {selectedAddress.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress.country}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune adresse sélectionnée</p>
                )}
              </CardContent>
            </Card>

            {/* Méthode de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Méthode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>Carte bancaire</span>
                  </Button>
                  
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <Euro className="w-6 h-6" />
                    <span>Espèces</span>
                  </Button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Numéro de carte</Label>
                        <Input 
                          id="card-number" 
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Nom sur la carte</Label>
                        <Input id="card-name" placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Expiration</Label>
                        <Input id="card-expiry" placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-cvc">CVC</Label>
                        <Input id="card-cvc" placeholder="123" maxLength={3} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Heure de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Heure de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Livraison estimée : 25-35 min
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé de commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Articles */}
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={`${item.menuItem.id}-${item.specialInstructions || ''}-${index}`} className="flex items-start gap-3">
                      <img 
                        src={item.menuItem.image} 
                        alt={item.menuItem.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.menuItem.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.menuItem.price.toFixed(2)}€
                        </p>
                        {item.specialInstructions && (
                          <p className="text-xs text-muted-foreground italic">
                            {item.specialInstructions}
                          </p>
                        )}
                        
                        {/* Contrôles quantité */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1, item.specialInstructions)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1, item.specialInstructions)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {(item.menuItem.price * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>{deliveryFee.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes</span>
                    <span>{taxes.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || orderLoading || !selectedAddress}
                  className="w-full"
                  size="lg"
                >
                  {(isProcessing || orderLoading) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmer la commande
                    </>
                  )}
                </Button>

                {!selectedAddress && (
                  <p className="text-xs text-red-600 text-center">
                    Veuillez sélectionner une adresse de livraison
                  </p>
                )}

                {orderError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-xs text-red-800 text-center">
                      {orderError}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}