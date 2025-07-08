import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useOrder } from '../../hooks/useOrder';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { RoleGuard } from '../../components/RoleGuard';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { ArrowLeft } from 'lucide-react';
import { RestaurantOrderStatus, UserRole } from '../../types/index';
import { 
  OrderStatusProgress,
  OrderActions,
  OrderDetails,
  CustomerInfo 
} from '../../components/restaurant';

export const Route = createFileRoute('/restaurant/order-tracking/$orderId')({
  component: () => (
    <RoleGuard allowedRoles={[UserRole.RESTAURANT]}>
      <RestaurantOrderTrackingPage />
    </RoleGuard>
  ),
  validateSearch: (search: Record<string, unknown>) => ({
    total: search.total as string,
    restaurant: search.restaurant as string
  })
});

function RestaurantOrderTrackingPage() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { getOrderById, currentOrder, loading, error } = useOrder();

  const [estimatedTime, setEstimatedTime] = useState(35);
  const [orderTime, setOrderTime] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Charger les détails de la commande
  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        await getOrderById(orderId);
      }
    };

    loadOrder();
  }, [orderId, getOrderById]);

  // Mettre à jour les données locales basées sur la commande chargée
  useEffect(() => {
    if (currentOrder) {
      const createdAt = new Date(currentOrder.dateCréation);
      setOrderTime(createdAt);
      
      // Ajuster le temps estimé selon le statut actuel
      const currentStatus = currentOrder.statut as RestaurantOrderStatus;
      switch (currentStatus) {
        case 'confirmed':
          setEstimatedTime(30);
          break;
        case 'preparing':
          setEstimatedTime(20);
          break;
        case 'ready':
          setEstimatedTime(10);
          break;
        case 'cancelled':
        case 'picked_up':
          setEstimatedTime(0);
          break;
        default:
          setEstimatedTime(35);
          break;
      }
    }
  }, [currentOrder]);

  // Utiliser le statut directement depuis currentOrder
  const orderStatus = (currentOrder?.statut as RestaurantOrderStatus) || 'pending';

  const updateOrderStatus = async (newStatus: RestaurantOrderStatus) => {
    if (!orderId) return;
    
    setIsUpdating(true);
    
    try {
      // Appel API réel pour changer le statut
      await orderService.updateRestaurantOrderStatus(orderId, newStatus, token);
      
      // Recharger les détails de la commande pour récupérer le nouveau statut
      await getOrderById(orderId);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      // Afficher une notification d'erreur à l'utilisateur
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Gestion de Commande</h1>
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
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Gestion de Commande</h1>
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
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/restaurant/dashboard' })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Commande #{orderId}</h1>
          <p className="text-lg text-muted-foreground">
            Reçue à {formatTime(orderTime.toISOString())}
          </p>
        </div>
      </div>

      {/* Actions rapides pour le restaurateur */}
      <OrderActions
        orderStatus={orderStatus}
        isUpdating={isUpdating}
        estimatedTime={estimatedTime}
        onStatusUpdate={updateOrderStatus}
      />

      {/* Progression du statut */}
      <OrderStatusProgress currentStatus={orderStatus} />

      {/* Détails de la commande et informations client */}
      {currentOrder && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Détails de la commande */}
          <OrderDetails order={currentOrder} />

          {/* Informations client */}
          <CustomerInfo order={currentOrder} orderStatus={orderStatus} />
        </div>
      )}
    </div>
  );
} 