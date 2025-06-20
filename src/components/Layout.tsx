import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from './Header';
import { CartSheet } from './CartSheet';
import { AddToCartDialog } from './AddToCartDialog';
import { AddressSelectionModal } from './AddressSelectionModal';
import { useCart } from '../providers/CartProvider';
import { useDialog } from '../providers/DialogProvider';
import type { MenuItem } from '../types';

interface LayoutProps {
  children: ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  deliveryFee?: number;
}

export const Layout = ({ 
  children, 
  searchQuery = '', 
  onSearchChange = () => {}, 
  deliveryFee = 0 
}: LayoutProps) => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartItemsCount,
    closeCart,
    toggleCart,
  } = useCart();

  const {
    dialogMenuItem,
    closeAddToCartDialog,
    isAddressModalOpen,
    closeAddressModal,
    selectedAddress,
    setSelectedAddress,
    addresses,
    addAddress,
    editAddress,
    deleteAddress,
  } = useDialog();

  const handleCheckout = () => {
    closeCart();
    navigate({ to: '/checkout' });
  };

  const handleAddToCartWithDialog = (menuItem: MenuItem, quantity: number, specialInstructions?: string) => {
    addToCart(menuItem, quantity, specialInstructions);
    closeAddToCartDialog();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={getCartItemsCount()}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onCartClick={toggleCart}
        selectedAddress={selectedAddress}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Cart Sheet */}
      <CartSheet
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        deliveryFee={deliveryFee}
        isOpen={isCartOpen}
        onClose={closeCart}
      />

      {/* Dialog pour ajouter au panier */}
      <AddToCartDialog
        menuItem={dialogMenuItem}
        isOpen={!!dialogMenuItem}
        onClose={closeAddToCartDialog}
        onAddToCart={handleAddToCartWithDialog}
      />

      {/* Modal de sélection d'adresse */}
      <AddressSelectionModal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
        onAddAddress={addAddress}
        onEditAddress={editAddress}
        onDeleteAddress={deleteAddress}
      />
    </div>
  );
}; 