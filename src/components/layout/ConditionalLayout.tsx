'use client';

import Header from './Header';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import StoreModal from '@/components/store/StoreModal';
import CompareModal from '@/components/product/CompareModal';
import ToastContainer from '@/components/ui/Toast';
import RegionModal from '@/components/region/RegionModal';
import { ThemeEditorPanel } from '@/components/theme/ThemeEditorPanel';
import type { ReactNode } from 'react';

export function ConditionalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <StoreModal />
      <CompareModal />
      <ToastContainer />
      <RegionModal />
      <ThemeEditorPanel />
    </>
  );
}
