import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  CheckCircle, 
  Clock, 
  ChefHat,
  CookingPot,
  Bike,
  XCircle
} from 'lucide-react';
import { UnifiedOrderStatus } from '../../types/index';

interface StatusStep {
  key: UnifiedOrderStatus;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface OrderStatusProgressProps {
  currentStatus: UnifiedOrderStatus;
}

const statusSteps: StatusStep[] = [
  { 
    key: UnifiedOrderStatus.PENDING, 
    label: 'En attente', 
    icon: <Clock className="w-4 h-4" />,
    description: 'Commande en attente de confirmation',
    color: 'bg-yellow-500'
  },
  { 
    key: UnifiedOrderStatus.CONFIRMED, 
    label: 'Confirmée', 
    icon: <CheckCircle className="w-4 h-4" />,
    description: 'Commande confirmée par le restaurant',
    color: 'bg-blue-500'
  },
  { 
    key: UnifiedOrderStatus.PREPARING, 
    label: 'En préparation', 
    icon: <ChefHat className="w-4 h-4" />,
    description: 'Votre équipe prépare la commande',
    color: 'bg-orange-500'
  },
  { 
    key: UnifiedOrderStatus.READY, 
    label: 'Prête', 
    icon: <CookingPot className="w-4 h-4" />,
    description: 'Commande prête pour récupération',
    color: 'bg-green-500'
  },
  { 
    key: UnifiedOrderStatus.PICKED_UP, 
    label: 'Récupérée', 
    icon: <Bike className="w-4 h-4" />,
    description: 'Récupérée par le livreur',
    color: 'bg-purple-500'
  }
];

export const OrderStatusProgress = ({ currentStatus }: OrderStatusProgressProps) => {
  const currentStepIndex = statusSteps.findIndex(step => step.key === currentStatus);
  
  // Si la commande est annulée, afficher un état spécial
  if (currentStatus === UnifiedOrderStatus.CANCELLED) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Commande Annulée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">Cette commande a été annulée et ne sera pas préparée.</p>
        </CardContent>
      </Card>
    );
  }

  // Si le statut n'est pas reconnu, utiliser l'index 0 par défaut
  const safeCurrentStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < safeCurrentStepIndex) return 'bg-green-600 border-green-600 text-white';
    if (stepIndex === safeCurrentStepIndex) return 'bg-blue-600 border-blue-600 text-white';
    return 'bg-gray-200 border-gray-300 text-gray-500';
  };

  const getProgressWidth = () => {
    return `${(safeCurrentStepIndex / (statusSteps.length - 1)) * 100}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Statut de la Commande</span>
          <span className="text-sm font-normal text-muted-foreground">
            Actuel: {statusSteps[safeCurrentStepIndex]?.label || currentStatus}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Barre de progression */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
              style={{ width: getProgressWidth() }}
            />
          </div>

          {/* Étapes */}
          <div className="relative flex justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center space-y-2">
                <div className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${getStatusColor(index)}
                `}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground max-w-24">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 