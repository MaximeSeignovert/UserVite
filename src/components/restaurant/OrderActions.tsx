import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertCircle } from 'lucide-react';
import { UnifiedOrderStatus } from '../../types/index';

interface OrderActionsProps {
  orderStatus: UnifiedOrderStatus;
  isUpdating: boolean;
  estimatedTime: number;
  onStatusUpdate: (newStatus: UnifiedOrderStatus) => void;
}

export const OrderActions = ({ 
  orderStatus, 
  isUpdating, 
  estimatedTime, 
  onStatusUpdate 
}: OrderActionsProps) => {
  const renderActionButtons = () => {
    switch (orderStatus) {
      case UnifiedOrderStatus.PENDING:
        return (
          <>
            <Button
              onClick={() => onStatusUpdate(UnifiedOrderStatus.CONFIRMED)}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? 'Confirmation...' : 'Confirmer la commande'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => onStatusUpdate(UnifiedOrderStatus.CANCELLED)}
              disabled={isUpdating}
            >
              {isUpdating ? 'Annulation...' : 'Refuser la commande'}
            </Button>
          </>
        );

      case UnifiedOrderStatus.CONFIRMED:
        return (
          <Button
            onClick={() => onStatusUpdate(UnifiedOrderStatus.PREPARING)}
            disabled={isUpdating}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isUpdating ? 'Démarrage...' : 'Commencer la préparation'}
          </Button>
        );

      case UnifiedOrderStatus.PREPARING:
        return (
          <Button
            onClick={() => onStatusUpdate(UnifiedOrderStatus.READY)}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? 'Finalisation...' : 'Marquer comme prête'}
          </Button>
        );

      case UnifiedOrderStatus.READY:
        return (
          <Badge variant="outline" className="text-green-600 text-base px-4 py-2">
            En attente du livreur
          </Badge>
        );

      case UnifiedOrderStatus.PICKED_UP:
        return (
          <Badge variant="outline" className="text-purple-600 text-base px-4 py-2">
            Commande récupérée par le livreur
          </Badge>
        );

      case UnifiedOrderStatus.CANCELLED:
        return (
          <Badge variant="destructive" className="text-base px-4 py-2">
            Commande annulée
          </Badge>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Actions Restaurateur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {renderActionButtons()}
        </div>
        {estimatedTime > 0 && orderStatus !== UnifiedOrderStatus.PICKED_UP && orderStatus !== UnifiedOrderStatus.CANCELLED && (
          <p className="text-sm text-gray-600 mt-2">
            Temps estimé restant: {estimatedTime} minutes
          </p>
        )}
        {orderStatus === UnifiedOrderStatus.CANCELLED && (
          <p className="text-sm text-red-600 mt-2">
            Cette commande a été annulée et ne peut plus être modifiée.
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 