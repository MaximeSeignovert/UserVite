import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MenuItem, Address } from '../types';

interface DialogContextType {
  dialogMenuItem: MenuItem | null;
  openAddToCartDialog: (menuItem: MenuItem) => void;
  closeAddToCartDialog: () => void;
  isAddressModalOpen: boolean;
  openAddressModal: () => void;
  closeAddressModal: () => void;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  editAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialogMenuItem, setDialogMenuItem] = useState<MenuItem | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      street: '123 Rue de Rivoli',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    {
      id: '2',
      street: '456 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
    },
    {
      id: '3',
      street: '789 Boulevard Saint-Germain',
      city: 'Paris',
      postalCode: '75006',
      country: 'France',
    },
  ]);

  const openAddToCartDialog = useCallback((menuItem: MenuItem) => {
    setDialogMenuItem(menuItem);
  }, []);

  const closeAddToCartDialog = useCallback(() => {
    setDialogMenuItem(null);
  }, []);

  const openAddressModal = useCallback(() => {
    setIsAddressModalOpen(true);
  }, []);

  const closeAddressModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, []);

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses(prev => [...prev, newAddress]);
  }, []);

  const editAddress = useCallback((updatedAddress: Address) => {
    setAddresses(prev => 
      prev.map(addr => 
        addr.id === updatedAddress.id ? updatedAddress : addr
      )
    );
  }, []);

  const deleteAddress = useCallback((addressId: string) => {
    setAddresses(prev => {
      const newAddresses = prev.filter(addr => addr.id !== addressId);
      
      // Si l'adresse supprimée était sélectionnée, sélectionner la première restante
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(newAddresses.length > 0 ? newAddresses[0] : null);
      }
      
      return newAddresses;
    });
  }, [selectedAddress]);

  // Sélectionner la première adresse au premier rendu
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const value: DialogContextType = {
    dialogMenuItem,
    openAddToCartDialog,
    closeAddToCartDialog,
    isAddressModalOpen,
    openAddressModal,
    closeAddressModal,
    selectedAddress,
    setSelectedAddress,
    addresses,
    addAddress,
    editAddress,
    deleteAddress,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}; 