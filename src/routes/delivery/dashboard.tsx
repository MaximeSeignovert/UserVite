import { createFileRoute } from '@tanstack/react-router';
import { RoleGuard } from '../../components/RoleGuard';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck,
  User,
  Euro,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { DeliveryService } from '../../services/deliveryService';
import type { Livraison } from '../../types/index';
import { UserRole, UnifiedOrderStatus } from '../../types/index';

export const Route = createFileRoute('/delivery/dashboard')({
  component: DeliveryDashboard,
});

function DeliveryDashboard() {
  return (
    <RoleGuard allowedRoles={[UserRole.DELIVERY]}>
      <DeliveryDashboardContent />
    </RoleGuard>
  );
}

function DeliveryDashboardContent() {
  const { user, token } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableLivraisons, setAvailableLivraisons] = useState<Livraison[]>([]);
  const [myLivraisons, setMyLivraisons] = useState<Livraison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Charger les données au montage du composant
  useEffect(() => {
    if (user?.id && token) {
      loadDashboardData();
    }
  }, [user?.id, token]);

  const loadDashboardData = async () => {
    if (!user?.id || !token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Charger les livraisons disponibles et les livraisons du livreur en parallèle
      const [availableData, myLivraisonsData] = await Promise.all([
        DeliveryService.getAvailableLivraisons(token),
        DeliveryService.getLivraisonsByLivreur(user.id, token)
      ]);

      setAvailableLivraisons(availableData);
      setMyLivraisons(myLivraisonsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      console.error('Erreur dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    // Pour l'instant, on toggle juste le state local
    // Plus tard, on pourra appeler une API pour mettre à jour le statut
    setIsAvailable(!isAvailable);
  };

  const handleTakeOrder = (livraisonId: string) => {
    // Placeholder pour la prise en charge d'une livraison
    alert(`Prise en charge de la livraison ${livraisonId}`);
    // TODO: Implémenter la route PATCH pour prendre en charge une livraison
  };

  const getStatusColor = (status: UnifiedOrderStatus | undefined) => {
    switch (status) {
      case UnifiedOrderStatus.PENDING: return 'bg-gray-100 text-gray-800';
      case UnifiedOrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-800';
      case UnifiedOrderStatus.PREPARING: return 'bg-yellow-100 text-yellow-800';
      case UnifiedOrderStatus.READY: return 'bg-green-100 text-green-800';
      case UnifiedOrderStatus.ON_THE_WAY: return 'bg-purple-100 text-purple-800';
      case UnifiedOrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
      case UnifiedOrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: UnifiedOrderStatus | undefined) => {
    switch (status) {
      case UnifiedOrderStatus.PENDING: return 'En attente';
      case UnifiedOrderStatus.CONFIRMED: return 'Confirmée';
      case UnifiedOrderStatus.PREPARING: return 'En préparation';
      case UnifiedOrderStatus.READY: return 'Prête';
      case UnifiedOrderStatus.ON_THE_WAY: return 'En livraison';
      case UnifiedOrderStatus.DELIVERED: return 'Livrée';
      case UnifiedOrderStatus.CANCELLED: return 'Annulée';
      default: return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Livreur
              </h1>
              <p className="text-gray-600 mt-1">
                Bonjour {user?.firstname ? `${user.firstname} ${user.lastname}` : user?.username} !
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                onClick={loadDashboardData}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              
              {/* Toggle disponibilité */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Statut :
                </span>
                <Badge 
                  className={isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {isAvailable ? 'Disponible' : 'Indisponible'}
                </Badge>
              </div>
              <Button
                onClick={handleAvailabilityToggle}
                variant={isAvailable ? 'destructive' : 'default'}
                size="sm"
              >
                {isAvailable ? 'Se déconnecter' : 'Se connecter'}
              </Button>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
            <Button 
              onClick={() => setError('')} 
              variant="ghost" 
              size="sm" 
              className="mt-2"
            >
              Fermer
            </Button>
          </div>
        )}

        {/* Statistiques du jour */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livraisons disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{availableLivraisons.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mes livraisons</p>
                <p className="text-2xl font-bold text-gray-900">{myLivraisons.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livrées aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myLivraisons.filter(l => l.status === UnifiedOrderStatus.DELIVERED).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Euro className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gains estimés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myLivraisons
                    .filter(l => l.status === UnifiedOrderStatus.DELIVERED)
                    .reduce((sum, l) => sum + (l.totalAmount * 0.1), 0)
                    .toFixed(2)}€
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Livraisons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Livraisons disponibles (à gauche) */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📦 Livraisons disponibles ({availableLivraisons.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableLivraisons.length === 0 ? (
                <Card className="p-6">
                  <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune livraison disponible</p>
                    <p className="text-sm">Les livraisons prêtes apparaîtront ici</p>
                  </div>
                </Card>
              ) : (
                availableLivraisons.map((livraison) => (
                  <Card key={livraison.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{livraison.restaurantName}</h3>
                        <p className="text-sm text-gray-600">Livraison #{livraison.id}</p>
                      </div>
                      <Badge className={getStatusColor(livraison.status)}>
                        {getStatusText(livraison.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {livraison.customerName && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{livraison.customerName}</span>
                        </div>
                      )}
                      
                      {livraison.deliveryAddress && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-700">{livraison.deliveryAddress}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {formatDateTime(livraison.created_at)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{livraison.totalAmount?.toFixed(2)}€</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleTakeOrder(livraison.id)}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Prendre cette livraison
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Mes livraisons (à droite) */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🚚 Mes livraisons ({myLivraisons.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {myLivraisons.length === 0 ? (
                <Card className="p-6">
                  <div className="text-center text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune livraison assignée</p>
                    <p className="text-sm">Prenez une livraison pour la voir ici</p>
                  </div>
                </Card>
              ) : (
                myLivraisons.map((livraison) => (
                  <Card key={livraison.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{livraison.restaurantName}</h3>
                        <p className="text-sm text-gray-600">Livraison #{livraison.id}</p>
                      </div>
                      <Badge className={getStatusColor(livraison.status)}>
                        {getStatusText(livraison.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {livraison.customerName && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{livraison.customerName}</span>
                        </div>
                      )}
                      
                      {livraison.deliveryAddress && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-700">{livraison.deliveryAddress}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        {livraison.actualPickupTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              Récupérée: {formatDateTime(livraison.actualPickupTime)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{livraison.totalAmount?.toFixed(2)}€</span>
                      </div>
                      
                      {livraison.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Notes:</strong> {livraison.notes}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 