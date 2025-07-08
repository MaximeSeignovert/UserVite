import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { RoleGuard } from '../../components/RoleGuard';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { RefreshCw, AlertCircle } from 'lucide-react';
import type { Commande } from '../../types/index';
import { UnifiedOrderStatus, UserRole } from '../../types/index';

export const Route = createFileRoute('/restaurant/dashboard')({
  component: () => (
    <RoleGuard allowedRoles={[UserRole.RESTAURANT]}>
      <RestaurantDashboard />
    </RoleGuard>
  ),
});

function RestaurantDashboard() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());

  // Charger les commandes du restaurant depuis l'API
  useEffect(() => {
    loadRestaurantOrders();
  }, []);

  const loadRestaurantOrders = async () => {
    if (!user?.id || !token) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Pour l'instant, on assume que l'ID utilisateur = ID restaurant
      // En production, il faudrait avoir une relation User -> Restaurant
      const restaurantOrders = await orderService.getCommandes(token);
      setOrders(restaurantOrders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des commandes';
      setError(errorMessage);
      console.error('Erreur lors du chargement des commandes:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: UnifiedOrderStatus) => {
    // Ajouter l'ID à la liste des commandes en cours de mise à jour
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    try {
      // Appel API réel pour changer le statut
      await orderService.updateRestaurantOrderStatus(orderId, newStatus, token);
      
      // Recharger toutes les commandes pour s'assurer de la cohérence
      await loadRestaurantOrders();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut');
    } finally {
      // Retirer l'ID de la liste des commandes en cours de mise à jour
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case UnifiedOrderStatus.PENDING:
        return 'destructive';
      case UnifiedOrderStatus.CONFIRMED:
        return 'secondary';
      case UnifiedOrderStatus.PREPARING:
        return 'default';
      case UnifiedOrderStatus.READY:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case UnifiedOrderStatus.PENDING:
        return 'En attente';
      case UnifiedOrderStatus.CONFIRMED:
        return 'Confirmée';
      case UnifiedOrderStatus.PREPARING:
        return 'En préparation';
      case UnifiedOrderStatus.READY:
        return 'Prête';
      case UnifiedOrderStatus.PICKED_UP:
        return 'Récupérée';
      case UnifiedOrderStatus.CANCELLED:
        return 'Annulée';
      default:
        return status;
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.statut === selectedStatus);

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2) + ' €';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getProductName = (produitId: string) => {
    // Mapping simple pour des noms plus lisibles
    // En production, cela devrait venir d'une API de produits
    const productNames: Record<string, string> = {
      'burger-1': 'Burger Classic',
      'fries-1': 'Frites',
      'pizza-1': 'Pizza Margherita',
      'salad-1': 'Salade César',
      'drink-1': 'Boisson',
    };
    return productNames[produitId] || `Produit ${produitId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Restaurateur
            </h1>
            <p className="text-gray-600 mt-2">
              Bonjour {user?.firstname || user?.username}, gérez vos commandes
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRestaurantOrders}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
        
        {/* Affichage des erreurs */}
        {error && (
          <Card className="mt-4 bg-red-50 border-red-200">
            <div className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-red-800 font-medium">Erreur</h4>
                <p className="text-red-700 text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setError('')}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            Toutes ({orders.length})
          </Button>
          <Button
            variant={selectedStatus === UnifiedOrderStatus.PENDING ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus(UnifiedOrderStatus.PENDING)}
          >
            En attente ({orders.filter(o => o.statut === UnifiedOrderStatus.PENDING).length})
          </Button>
          <Button
            variant={selectedStatus === UnifiedOrderStatus.CONFIRMED ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus(UnifiedOrderStatus.CONFIRMED)}
          >
            Confirmées ({orders.filter(o => o.statut === UnifiedOrderStatus.CONFIRMED).length})
          </Button>
          <Button
            variant={selectedStatus === UnifiedOrderStatus.PREPARING ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus(UnifiedOrderStatus.PREPARING)}
          >
            En préparation ({orders.filter(o => o.statut === UnifiedOrderStatus.PREPARING).length})
          </Button>
          <Button
            variant={selectedStatus === UnifiedOrderStatus.READY ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus(UnifiedOrderStatus.READY)}
          >
            Prêtes ({orders.filter(o => o.statut === UnifiedOrderStatus.READY).length})
          </Button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">
              {selectedStatus === 'all' 
                ? 'Aucune commande pour le moment' 
                : `Aucune commande ${getStatusLabel(selectedStatus).toLowerCase()}`
              }
            </p>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Commande #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatTime(order.dateCréation)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant(order.statut)}>
                    {getStatusLabel(order.statut)}
                  </Badge>
                  <p className="text-lg font-bold mt-1">
                    {formatPrice(order.prixTotal)}
                  </p>
                </div>
              </div>

              {/* Articles de la commande */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Articles:</h4>
                <div className="space-y-1">
                  {order.produits.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantite}x {getProductName(item.produitId)}
                      </span>
                      <span>{formatPrice(item.prixUnitaire * item.quantite)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {order.statut === UnifiedOrderStatus.PENDING && (
                  <>
                    <Button
                      size="sm"
                      disabled={updatingOrders.has(order.id)}
                      onClick={() => updateOrderStatus(order.id, UnifiedOrderStatus.CONFIRMED)}
                    >
                      {updatingOrders.has(order.id) ? 'Confirmation...' : 'Confirmer'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={updatingOrders.has(order.id)}
                      onClick={() => updateOrderStatus(order.id, UnifiedOrderStatus.CANCELLED)}
                    >
                      {updatingOrders.has(order.id) ? 'Annulation...' : 'Refuser'}
                    </Button>
                  </>
                )}
                {order.statut === UnifiedOrderStatus.CONFIRMED && (
                  <Button
                    size="sm"
                    disabled={updatingOrders.has(order.id)}
                    onClick={() => updateOrderStatus(order.id, UnifiedOrderStatus.PREPARING)}
                  >
                    {updatingOrders.has(order.id) ? 'Démarrage...' : 'Commencer la préparation'}
                  </Button>
                )}
                {order.statut === UnifiedOrderStatus.PREPARING && (
                  <Button
                    size="sm"
                    disabled={updatingOrders.has(order.id)}
                    onClick={() => updateOrderStatus(order.id, UnifiedOrderStatus.READY)}
                  >
                    {updatingOrders.has(order.id) ? 'Finalisation...' : 'Marquer comme prête'}
                  </Button>
                )}
                {order.statut === UnifiedOrderStatus.READY && (
                  <Badge variant="outline" className="text-green-600">
                    En attente du livreur
                  </Badge>
                )}
                {order.statut === UnifiedOrderStatus.CANCELLED && (
                  <Badge variant="destructive">
                    Commande annulée
                  </Badge>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 