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
  Euro
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/delivery/dashboard')({
  component: DeliveryDashboard,
});

function DeliveryDashboard() {
  return (
    <RoleGuard allowedRoles={['delivery']}>
      <DeliveryDashboardContent />
    </RoleGuard>
  );
}

function DeliveryDashboardContent() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);

  // Données mockées pour les livraisons
  const deliveryStats = {
    todayDeliveries: 8,
    totalEarnings: 156.50,
    averageRating: 4.8,
    completionRate: 96
  };

  const pendingDeliveries = [
    {
      id: '1',
      orderId: 'ORD-001',
      restaurant: 'Burger Palace',
      customer: 'Marie Dupont',
      address: '15 Rue de la Paix, 75001 Paris',
      estimatedTime: '25 min',
      amount: 28.50,
      status: 'ready'
    },
    {
      id: '2',
      orderId: 'ORD-002',
      restaurant: 'Pizza Corner',
      customer: 'Jean Martin',
      address: '42 Avenue des Champs, 75008 Paris',
      estimatedTime: '18 min',
      amount: 45.20,
      status: 'preparing'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'delivering': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Prêt';
      case 'preparing': return 'En préparation';
      case 'delivering': return 'En livraison';
      default: return status;
    }
  };

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
            
            {/* Toggle disponibilité */}
            <div className="flex items-center gap-4">
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
                onClick={() => setIsAvailable(!isAvailable)}
                variant={isAvailable ? 'destructive' : 'default'}
                size="sm"
              >
                {isAvailable ? 'Se déconnecter' : 'Se connecter'}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques du jour */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livraisons aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{deliveryStats.todayDeliveries}</p>
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
                <p className="text-2xl font-bold text-gray-900">{deliveryStats.totalEarnings.toFixed(2)}€</p>
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
                <p className="text-2xl font-bold text-gray-900">{deliveryStats.averageRating}/5</p>
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
                <p className="text-2xl font-bold text-gray-900">{deliveryStats.completionRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Livraisons en attente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Livraisons disponibles
            </h2>
            <div className="space-y-4">
              {pendingDeliveries.map((delivery) => (
                <Card key={delivery.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{delivery.restaurant}</h3>
                      <p className="text-sm text-gray-600">Commande #{delivery.orderId}</p>
                    </div>
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusText(delivery.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{delivery.customer}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-700">{delivery.address}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{delivery.estimatedTime}</span>
                      </div>
                      <span className="font-medium text-gray-900">{delivery.amount.toFixed(2)}€</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {delivery.status === 'ready' ? (
                      <>
                        <Button size="sm" className="flex-1">
                          <Truck className="w-4 h-4 mr-2" />
                          Accepter la livraison
                        </Button>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1">
                        Voir détails
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Historique récent */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Livraisons récentes
            </h2>
            <Card className="p-6">
              <div className="text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune livraison récente</p>
                <p className="text-sm">Vos dernières livraisons apparaîtront ici</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 