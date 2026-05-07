'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens, WishlistItem, Address, Order, Product } from '@/types';
import { saveSession, logout as clearSession, loadSession } from '@/services/userService';

interface UserState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoggedIn: boolean;
  wishlist: WishlistItem[];
  addresses: Address[];
  orders: Order[];
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  restoreSession: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoggedIn: false,
      wishlist: [],
      addresses: [
        {
          id: '1',
          label: 'Home',
          fullName: 'John Doe',
          street: '123 Main Street, Apt 4B',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          phone: '+1 (555) 123-4567',
          isDefault: true,
        },
        {
          id: '2',
          label: 'Office',
          fullName: 'John Doe',
          street: '456 Business Ave, Suite 200',
          city: 'New York',
          state: 'NY',
          zip: '10013',
          phone: '+1 (555) 234-5678',
        },
      ],
      orders: [],
      login: (user, tokens) => {
        saveSession(user, tokens);
        set({ user, tokens, isLoggedIn: true });
      },
      logout: () => {
        clearSession();
        set({ user: null, tokens: null, isLoggedIn: false });
      },
      restoreSession: () => {
        const session = loadSession();
        if (session) {
          set({ user: session.user, tokens: session.tokens, isLoggedIn: true });
        }
      },
      addToWishlist: (product) => {
        set((state) => ({
          wishlist: [...state.wishlist, { product, addedAt: new Date().toISOString() }],
        }));
      },
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((w) => w.product.id !== productId),
        })),
      isInWishlist: (productId) =>
        get().wishlist.some((w) => w.product.id === productId),
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      removeAddress: (addressId) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== addressId),
        })),
    }),
    { name: 'storefront-user' }
  )
);
