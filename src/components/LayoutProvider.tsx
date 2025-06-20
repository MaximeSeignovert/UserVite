import type { ReactNode } from 'react';
import { CartProvider } from '../providers/CartProvider';
import { DialogProvider } from '../providers/DialogProvider';
import { Layout } from './Layout';

interface LayoutProviderProps {
  children: ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  deliveryFee?: number;
}

export const LayoutProvider = ({ 
  children, 
  searchQuery, 
  onSearchChange, 
  deliveryFee 
}: LayoutProviderProps) => {
  return (
    <CartProvider>
      <DialogProvider>
        <Layout 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          deliveryFee={deliveryFee}
        >
          {children}
        </Layout>
      </DialogProvider>
    </CartProvider>
  );
}; 