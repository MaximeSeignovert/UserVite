import { useState, useEffect } from 'react';
import type { Address, AddressFeature } from '../types';
import { useAddressSearch } from '../hooks/useAddressSearch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { MapPin, Plus, Check, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddAddress: (address: Omit<Address, 'id'>) => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (addressId: string) => void;
}

export const AddressSelectionModal = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}: AddressSelectionModalProps) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<AddressFeature | null>(null);
  
  const { suggestions, isLoading, error, searchAddresses, clearSuggestions } = useAddressSearch();

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  console.log(selectedSuggestion);


  // Recherche d'adresses avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && isAddingAddress) {
        searchAddresses(searchQuery);
      } else {
        clearSuggestions();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isAddingAddress, searchAddresses, clearSuggestions]);
  
  const handleSelectSuggestion = (suggestion: AddressFeature) => {
    setSelectedSuggestion(suggestion);
    setSearchQuery(suggestion.properties.label);
    setNewAddress({
      street: suggestion.properties.name,
      city: suggestion.properties.city,
      postalCode: suggestion.properties.postcode,
      country: 'France',
    });
    clearSuggestions();
  };

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.postalCode) {
      onAddAddress(newAddress);
      setNewAddress({
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
      });
      setSearchQuery('');
      setSelectedSuggestion(null);
      setIsAddingAddress(false);
    }
  };

  const handleEditAddress = () => {
    if (editingAddress && editingAddress.street && editingAddress.city && editingAddress.postalCode) {
      onEditAddress(editingAddress);
      setEditingAddress(null);
    }
  };

  const handleSelectAndClose = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  const handleCancelAdd = () => {
    setIsAddingAddress(false);
    setSearchQuery('');
    setSelectedSuggestion(null);
    setNewAddress({
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    });
    clearSuggestions();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Choisir une adresse de livraison
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Liste des adresses existantes */}
          {addresses.length > 0 && (
            <div className="space-y-3">
              {addresses.map((address) => (
                <Card 
                  key={address.id}
                  className={`cursor-pointer transition-colors ${
                    selectedAddress?.id === address.id 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1"
                        onClick={() => handleSelectAndClose(address)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{address.street}</h4>
                          {selectedAddress?.id === address.id && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.country}
                        </p>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(address);
                          }}
                          className="w-8 h-8 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAddress(address.id);
                          }}
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bouton pour ajouter une nouvelle adresse */}
          {!isAddingAddress && !editingAddress && (
            <Button
              variant="outline"
              onClick={() => setIsAddingAddress(true)}
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter une nouvelle adresse
            </Button>
          )}

          {/* Formulaire d'ajout d'adresse avec API */}
          {isAddingAddress && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Nouvelle adresse</h4>
                
                {/* Recherche d'adresse */}
                <div className="space-y-2">
                  <Label htmlFor="address-search">Rechercher une adresse</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="address-search"
                      placeholder="Tapez votre adresse..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    {isLoading && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
                    )}
                  </div>
                  
                  {/* Suggestions d'adresses */}
                  {suggestions.length > 0 && (
                    <div className="border rounded-md bg-white shadow-sm max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.properties.id}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <div className="font-medium text-sm">
                            {suggestion.properties.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {suggestion.properties.context}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Champs manuels */}
                <div className="space-y-2">
                  <Label htmlFor="street">Adresse</Label>
                  <Input
                    id="street"
                    placeholder="123 Rue de la République"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      placeholder="Paris"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      placeholder="75001"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddAddress} size="sm">
                    Ajouter
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelAdd} 
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulaire d'édition d'adresse */}
          {editingAddress && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Modifier l'adresse</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-street">Adresse</Label>
                  <Input
                    id="edit-street"
                    value={editingAddress.street}
                    onChange={(e) => setEditingAddress({ ...editingAddress, street: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">Ville</Label>
                    <Input
                      id="edit-city"
                      value={editingAddress.city}
                      onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-postalCode">Code postal</Label>
                    <Input
                      id="edit-postalCode"
                      value={editingAddress.postalCode}
                      onChange={(e) => setEditingAddress({ ...editingAddress, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-country">Pays</Label>
                  <Input
                    id="edit-country"
                    value={editingAddress.country}
                    onChange={(e) => setEditingAddress({ ...editingAddress, country: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleEditAddress} size="sm">
                    Sauvegarder
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingAddress(null)} 
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 