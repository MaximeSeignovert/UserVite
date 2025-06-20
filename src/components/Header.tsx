import { Search, MapPin, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Link } from '@tanstack/react-router';
import { useDialog } from '../providers/DialogProvider';
import type { Address } from '../types';

interface HeaderProps {
  cartItemsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  selectedAddress?: Address | null;
}

export const Header = ({ 
  cartItemsCount, 
  searchQuery, 
  onSearchChange, 
  onCartClick, 
  selectedAddress 
}: HeaderProps) => {
  const { openAddressModal } = useDialog();

  const displayAddress = selectedAddress 
    ? `${selectedAddress.street}, ${selectedAddress.city}`
    : 'Sélectionner une adresse';

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/"><h1 className="text-2xl font-bold text-green-600">UserVite</h1></Link>
          </div>

          {/* Adresse de livraison */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Livrer à</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-medium flex items-center gap-1 max-w-64 justify-start"
              onClick={openAddressModal}
            >
              <span className="truncate">{displayAddress}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            </Button>
          </div>

          {/* Version mobile de l'adresse */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={openAddressModal}
              className="flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher des restaurants ou des plats..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Panier</span>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white min-w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}; 