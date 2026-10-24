// ==============================================================================
// ShopSphere AI — Customer Orders Zustand Store
// Integrates initial orders fixture with client-side persistent storage
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order } from '@/types';
import ordersFixture from '../../fixtures/orders.json';

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: ordersFixture as unknown as Order[],

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },
    }),
    {
      name: 'shopsphere_orders',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
