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
  Star,
  Euro,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { DeliveryService } from '../../services/deliveryService';
import { orderService } from '../../services/orderService';
import type { Livraison, LivreurStats, Commande } from '../../types/index';
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
  const [deliveryStats] = useState<LivreurStats>({
    todayDeliveries: 0,
    totalEarnings: 0,
    averageRating: 0,
    completionRate: 0,
    totalDeliveries: 0
  });
  const [availableCommandes, setAvailableCommandes] = useState<Commande[]>([]);
  const [myLivraisons] = useState<Livraison[]>([]);
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
    console.log("loadDashboardData");
    
    setIsLoading(true);
    setError('');
    
    try {
      // Récupérer toutes les commandes et filtrer celles avec le statut "ready"
      const allCommandes = await orderService.getCommandes(token);
      const readyCommandes = allCommandes.filter(commande => commande.statut === UnifiedOrderStatus.READY);

      setAvailableCommandes(readyCommandes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      console.error('Erreur dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    if (!user?.id || !token) return;
    
    try {
      const newAvailability = !isAvailable;
      await DeliveryService.updateLivreur(user.id, { 
        isAvailable: newAvailability 
      }, token);
      setIsAvailable(newAvailability);
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error('Erreur toggle:', err);
    }
  };

  const handleTakeOrder = (commandeId: string) => {
    alert(`Prise en charge de la commande ${commandeId}`);
  };

  const handleUpdateStatus = async (livraisonId: string, newStatus: UnifiedOrderStatus) => {
    if (!token) return;
    
    try {
      await DeliveryService.updateLivraisonStatus(livraisonId, { 
        status: newStatus 
      }, token);
      // Recharger les données pour refléter les changements
      await loadDashboardData();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error('Erreur mise à jour statut:', err);
    }
  };

  const getStatusColor = (status: UnifiedOrderStatus | undefined) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: UnifiedOrderStatus | undefined) => {
    switch (status) {
      case UnifiedOrderStatus.PENDING: return 'En attente';
      case UnifiedOrderStatus.ASSIGNED: return 'Assignée';
      case UnifiedOrderStatus.PICKED_UP: return 'Récupérée';
      case UnifiedOrderStatus.IN_TRANSIT: return 'En transit';
      case UnifiedOrderStatus.DELIVERED: return 'Livrée';
      case UnifiedOrderStatus.CANCELLED: return 'Annulée';
      default: return status;
    }
  };

  const getNextStatusAction = (status: UnifiedOrderStatus | undefined) => {
    switch (status) {
      case UnifiedOrderStatus.ASSIGNED: return { status: UnifiedOrderStatus.PICKED_UP, text: 'Marquer comme récupérée' };
      case UnifiedOrderStatus.PICKED_UP: return { status: UnifiedOrderStatus.IN_TRANSIT, text: 'Commencer la livraison' };
      case UnifiedOrderStatus.IN_TRANSIT: return { status: UnifiedOrderStatus.DELIVERED, text: 'Marquer comme livrée' };
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }
  console.log(myLivraisons);

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
                <p className="text-sm font-medium text-gray-600">Livraisons aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{deliveryStats?.todayDeliveries || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gains du jour</p>
                <p className="text-2xl font-bold text-gray-900">{(deliveryStats?.totalEarnings || 0)?.toFixed(2)}€</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold text-gray-900">{(deliveryStats?.averageRating || 0)?.toFixed(1)}/5</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
                <p className="text-2xl font-bold text-gray-900">{(deliveryStats?.completionRate || 0)?.toFixed(0)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Livraisons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commandes prêtes */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Commandes prêtes ({availableCommandes.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableCommandes.length === 0 ? (
                <Card className="p-6">
                  <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune commande prête</p>
                    <p className="text-sm">Les commandes prêtes apparaîtront ici</p>
                  </div>
                </Card>
              ) : (
                availableCommandes.map((commande) => (
                  <Card key={commande.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Restaurant #{commande.restaurantId}</h3>
                        <p className="text-sm text-gray-600">Commande #{commande.id}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Prête
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Client #{commande.clientId}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {new Date(commande.dateCréation).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{(commande.prixTotal / 100).toFixed(2)}€</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleTakeOrder(commande.id)}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Prendre la commande
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Mes livraisons */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Mes livraisons ({myLivraisons.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {myLivraisons.length === 0 ? (
                <Card className="p-6">
                  <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune livraison assignée</p>
                    <p className="text-sm">Acceptez des livraisons pour les voir ici</p>
                  </div>
                </Card>
              ) : (
                myLivraisons.map((livraison) => {
                  const nextAction = getNextStatusAction(livraison.status);
                  return (
                    <Card key={livraison.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{livraison.restaurantName}</h3>
                          <p className="text-sm text-gray-600">Commande #{livraison.orderId}</p>
                        </div>
                        <Badge className={getStatusColor(livraison.status)}>
                          {getStatusText(livraison.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{livraison.customerName}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-700">{livraison.deliveryAddress}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{livraison.totalAmount?.toFixed(2)}€</span>
                        </div>
                      </div>
                      
                      {nextAction && (
                        <div className="mt-4">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleUpdateStatus(livraison.id, nextAction.status)}
                          >
                            {nextAction.text}
                          </Button>
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 