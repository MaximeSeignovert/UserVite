import { Search, MapPin, ShoppingBag, User, ChevronDown, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDialog } from '../providers/DialogProvider';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import type { Address, AuthUser } from '../types';

interface HeaderProps {
  cartItemsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  selectedAddress?: Address | null;
}

// Composant Avatar avec fallback
const UserAvatar = ({ user, size = 'w-8 h-8' }: { user: AuthUser, size?: string }) => {
  const [imageError, setImageError] = useState(false);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (imageError || !user.profilePicture) {
    return (
      <div className={`${size} bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium`}>
        {getUserInitials(user.name)}
      </div>
    );
  }

  return (
    <img 
      src={user.profilePicture} 
      alt={user.name} 
      className={`${size} rounded-full object-cover`}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
};

export const Header = ({ 
  cartItemsCount, 
  searchQuery, 
  onSearchChange, 
  onCartClick, 
  selectedAddress 
}: HeaderProps) => {
  const { openAddressModal } = useDialog();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const displayAddress = selectedAddress 
    ? `${selectedAddress.street}, ${selectedAddress.city}`
    : 'Sélectionner une adresse';

  const handleLoginClick = () => {
    navigate({ to: '/auth/login' });
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

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
            {/* Authentification */}
            {isAuthenticated && user ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:flex items-center gap-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserAvatar user={user} />
                  <span className="max-w-24 truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>

                {/* Menu mobile utilisateur */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserAvatar user={user} />
                </Button>

                {/* Menu déroulant utilisateur */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex"
                onClick={handleLoginClick}
              >
                <User className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
            )}
            
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

      {/* Overlay pour fermer le menu utilisateur */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
}; 