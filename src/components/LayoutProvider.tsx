import type { ReactNode } from 'react';
import { CartProvider } from '../providers/CartProvider';
import { DialogProvider } from '../providers/DialogProvider';
import { SearchProvider } from '../providers/SearchProvider';
import { Layout } from './Layout';

interface LayoutProviderProps {
  children: ReactNode;
  deliveryFee?: number;
}

export const LayoutProvider = ({ 
  children, 
  deliveryFee 
}: LayoutProviderProps) => {
  return (
    <SearchProvider>
      <CartProvider>
        <DialogProvider>
          <Layout 
            deliveryFee={deliveryFee}
          >
            {children}
          </Layout>
        </DialogProvider>
      </CartProvider>
    </SearchProvider>
  );
}; 