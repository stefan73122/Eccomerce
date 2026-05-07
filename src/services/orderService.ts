import { Order } from '@/types';

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    date: '2024-12-15',
    status: 'delivered',
    items: [],
    total: 432.89,
    shippingAddress: {
      id: '1',
      label: 'Home',
      fullName: 'John Doe',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '+1 (555) 123-4567',
    },
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: '2024-12-18',
  },
  {
    id: 'ORD-2024-002',
    date: '2024-12-20',
    status: 'shipped',
    items: [],
    total: 189.99,
    shippingAddress: {
      id: '2',
      label: 'Office',
      fullName: 'John Doe',
      street: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zip: '10013',
      phone: '+1 (555) 234-5678',
    },
    trackingNumber: '1Z999AA10123456785',
    estimatedDelivery: '2024-12-23',
  },
];

export function getOrders(): Order[] {
  return mockOrders;
}

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id);
}

export function trackOrder(orderId: string): Order | undefined {
  return mockOrders.find((o) => o.id === orderId);
}
