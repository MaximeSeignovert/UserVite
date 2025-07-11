import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useOrder } from '../hooks/useOrder';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Home,
  Bike,
  ChefHat,
  CookingPot,
  Utensils,
  Star,
  MessageCircle,
  Navigation,
  User,
  ShoppingBag
} from 'lucide-react';

export const Route = createFileRoute('/order-tracking/$orderId')({
  component: OrderTrackingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    total: search.total as string,
    restaurant: search.restaurant as string
  })
});

type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'on-the-way' | 'delivered';

interface DeliveryDriver {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  estimatedArrival: string;
}

function OrderTrackingPage() {
  const { orderId } = Route.useParams();
  const { total, restaurant } = Route.useSearch();
  const navigate = useNavigate();
  const { getOrderById, currentOrder, loading, error } = useOrder();

  console.log("currentOrder",currentOrder);
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('confirmed');
  const [estimatedTime] = useState(35);
  const [orderTime, setOrderTime] = useState(new Date());
  const [driver] = useState<DeliveryDriver | null>(null);

  // Charger les détails de la commande
  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        await getOrderById(orderId);
      }
    };

    loadOrder();
  }, [orderId, getOrderById]);

  // Actualiser la commande toutes les 10 secondes
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        await getOrderById(orderId);
      } catch (error) {
        console.error('Erreur lors de l\'actualisation de la commande:', error);
      }
    }, 10000); // 10 secondes

    return () => clearInterval(interval);
  }, [orderId, getOrderById]);

  // Mettre à jour le statut local basé sur la commande chargée
  useEffect(() => {
    if (currentOrder) {
      setOrderStatus(currentOrder.statut as OrderStatus);
      // Utiliser la date de création de la commande
      const createdAt = new Date(currentOrder.dateCréation);
      setOrderTime(createdAt);
    }
  }, [currentOrder]);

  const statusSteps = [
    { 
      key: 'confirmed', 
      label: 'Confirmée', 
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Commande reçue par le restaurant'
    },
    { 
      key: 'preparing', 
      label: 'Préparation', 
      icon: <ChefHat className="w-4 h-4" />,
      description: 'Votre repas est en cours de préparation'
    },
    { 
      key: 'ready', 
      label: 'Prêt', 
      icon: <CookingPot className="w-4 h-4" />,
      description: 'Commande prête pour la livraison'
    },
    { 
      key: 'on-the-way', 
      label: 'En livraison', 
      icon: <Bike className="w-4 h-4" />,
      description: 'En route vers votre adresse'
    },
    { 
      key: 'delivered', 
      label: 'Livrée', 
      icon: <Utensils className="w-4 h-4" />,
      description: 'Bon appétit !'
    }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === orderStatus);

  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'bg-green-600 border-green-600 text-white';
    if (stepIndex === currentStepIndex) return 'bg-blue-600 border-blue-600 text-white';
    return 'bg-gray-200 border-gray-300 text-gray-500';
  };

  const getProgressWidth = () => {
    return `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`;
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Suivi de commande</h1>
          <p className="text-lg text-muted-foreground">Chargement des détails...</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Suivi de commande</h1>
          <p className="text-lg text-red-600">Erreur lors du chargement</p>
        </div>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-800">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Suivi de commande</h1>
          <p className="text-lg text-muted-foreground">
            Commande #{orderId} • {restaurant || 'Restaurant'}
          </p>
          <p className="text-sm text-muted-foreground">
            Commandé à {orderTime.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} • Total: {currentOrder?.totalPriceEuros?.toFixed(2) || total}€
          </p>
        </div>

        {/* Temps estimé */}
        {estimatedTime > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-blue-900 mb-1">
                Livraison dans {estimatedTime} minutes
              </h3>
              <p className="text-blue-700">
                Arrivée prévue vers {new Date(Date.now() + estimatedTime * 60000).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Message de livraison */}
        {orderStatus === 'delivered' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Utensils className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-green-900 mb-1">
                🎉 Commande livrée !
              </h3>
              <p className="text-green-700">
                Merci d'avoir choisi UserVite. Bon appétit !
              </p>
            </CardContent>
          </Card>
        )}

        {/* Timeline de progression */}
        <Card>
          <CardHeader>
            <CardTitle>Progression de votre commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barre de progression */}
            <div className="relative">
              <div className="flex justify-between items-center mb-4">
                {statusSteps.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center text-center flex-1">
                    <div 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-500 ${getStatusColor(index)}`}
                    >
                      {step.icon}
                    </div>
                    <span className="text-xs font-medium">{step.label}</span>
                  </div>
                ))}
              </div>
              
              {/* Ligne de progression */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-300 -z-10">
                <div 
                  className="h-full bg-green-600 transition-all duration-1000 ease-out"
                  style={{ width: getProgressWidth() }}
                />
              </div>
            </div>

            {/* Description de l'étape actuelle */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {statusSteps[currentStepIndex]?.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{statusSteps[currentStepIndex]?.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {statusSteps[currentStepIndex]?.description}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails de la commande */}
        {currentOrder && currentOrder.parsedCartItems && currentOrder.parsedCartItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Détails de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentOrder.parsedCartItems.map((item, index) => (
                <div key={`${item.menuItem.id}-${index}`} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <img 
                    src={item.menuItem.image} 
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{item.menuItem.name}</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.menuItem.description}
                    </p>
                    {item.specialInstructions && (
                      <p className="text-sm text-blue-600 italic">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        Quantité: {item.quantity}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        Prix unitaire: {item.menuItem.price.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {(item.menuItem.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total de la commande</span>
                  <span>{currentOrder.totalPriceEuros.toFixed(2)}€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations du livreur */}
        {driver && orderStatus === 'on-the-way' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Votre livreur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{driver.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{driver.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
                  <p className="text-sm text-muted-foreground">
                    Arrivée prévue: {driver.estimatedArrival}
                  </p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adresse de livraison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Adresse de livraison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">123 Rue de Rivoli</p>
              <p className="text-sm text-muted-foreground">75001 Paris, France</p>
              <p className="text-sm text-muted-foreground">Appartement 4B, 2ème étage</p>
            </div>
            
            {orderStatus === 'on-the-way' && (
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  Suivre sur la carte
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historique des mises à jour */}
        <Card>
          <CardHeader>
            <CardTitle>Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusSteps.slice(0, currentStepIndex + 1).reverse().map((step, index) => {
                const stepTime = new Date(orderTime.getTime() + (currentStepIndex - index) * 5 * 60000);
                return (
                  <div key={step.key} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step.label}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stepTime.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate({ to: '/' })}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <Button 
            onClick={() => navigate({ to: `/restaurant/${restaurant || '1'}` })}
            size="lg"
            className="w-full"
          >
            Recommander
          </Button>
        </div>

        {/* Support */}
        <Card className="bg-gray-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Un problème avec votre commande ?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                01 23 45 67 89
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
} 