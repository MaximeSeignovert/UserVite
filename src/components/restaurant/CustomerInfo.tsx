import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User } from 'lucide-react';
import type { Commande } from '../../types/index';
import { UnifiedOrderStatus } from '../../types/index';

interface CustomerInfoProps {
  order: Commande;
  orderStatus: UnifiedOrderStatus;
}

export const CustomerInfo = ({ order, orderStatus }: CustomerInfoProps) => {
  const getStatusLabel = (status: UnifiedOrderStatus) => {
    switch (status) {
      case UnifiedOrderStatus.PENDING:
        return UnifiedOrderStatus.PENDING;
      case UnifiedOrderStatus.CONFIRMED:
        return UnifiedOrderStatus.CONFIRMED;
      case UnifiedOrderStatus.PREPARING:
        return UnifiedOrderStatus.PREPARING;
      case UnifiedOrderStatus.READY:
        return UnifiedOrderStatus.READY;
      case UnifiedOrderStatus.PICKED_UP:
        return UnifiedOrderStatus.PICKED_UP;
      case UnifiedOrderStatus.CANCELLED:
        return UnifiedOrderStatus.CANCELLED;
      default:
        return status;
    }
  };

  const getStatusVariant = (status: UnifiedOrderStatus) => {
    switch (status) {
      case UnifiedOrderStatus.PENDING:
        return 'destructive';
      case UnifiedOrderStatus.CONFIRMED:
        return 'secondary';
      case UnifiedOrderStatus.PREPARING:
        return 'default';
      case UnifiedOrderStatus.READY:
        return 'outline';
      case UnifiedOrderStatus.PICKED_UP:
        return 'outline';
      case UnifiedOrderStatus.CANCELLED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDateTime(order.dateCréation);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations Client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations du client */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">ID Client</p>
            <p className="font-medium">{order.clientId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Restaurant</p>
            <p className="font-medium">{order.restaurantId}</p>
          </div>
        </div>

        {/* Informations de la commande */}
        <div className="border-t pt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-600">Date de commande</p>
            <p className="font-medium">{date}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Heure de commande</p>
            <p className="font-medium">{time}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Statut actuel</p>
            <Badge variant={getStatusVariant(orderStatus)} className="mt-1">
              {getStatusLabel(orderStatus)}
            </Badge>
          </div>
        </div>

        {/* Métriques de la commande */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ID Commande:</span>
            <span className="font-medium font-mono">{order.id}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Temps écoulé:</span>
            <span className="font-medium">
              {Math.round((Date.now() - new Date(order.dateCréation).getTime()) / (1000 * 60))} min
            </span>
          </div>
        </div>

        {        /* Notes ou instructions spéciales */}
        {orderStatus === UnifiedOrderStatus.PREPARING && (
          <div className="border-t pt-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800 font-medium">
                ⏱️ Commande en cours de préparation
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Veillez à respecter les temps de cuisson et la qualité.
              </p>
            </div>
          </div>
        )}

        {orderStatus === UnifiedOrderStatus.READY && (
          <div className="border-t pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 font-medium">
                ✅ Commande prête pour récupération
              </p>
              <p className="text-xs text-green-600 mt-1">
                En attente qu'un livreur récupère la commande.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 