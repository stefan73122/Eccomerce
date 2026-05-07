'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import ProgressSteps from '@/components/ui/ProgressSteps';
import OrderSummary from '@/components/checkout/OrderSummary';
import DeliverySection, { type ShippingResult } from '@/components/checkout/DeliverySection';
import CheckoutPaymentSection from '@/components/checkout/CheckoutPaymentSection';
import api from '@/lib/axios';

export default function CheckoutPage() {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const [deliveryTab, setDeliveryTab] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentTab, setPaymentTab] = useState<'qr' | 'cod'>('qr');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingResult | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const isSameRegion = !!(
    shippingInfo && (
      shippingInfo.coverageZone ||
      shippingInfo.originRegion === shippingInfo.destinationRegion
    )
  );

  useEffect(() => {
    if (paymentTab === 'cod' && !isSameRegion) setPaymentTab('qr');
  }, [isSameRegion, paymentTab]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && deliveryTab === 'delivery') return;
    setPlacingOrder(true);
    setOrderError(null);
    try {
      const body: Record<string, unknown> = {
        fulfillmentType: deliveryTab === 'delivery' ? 'SHIPPING' : 'PICKUP',
        paymentMethod: paymentTab === 'cod' ? 'CASH_ON_DELIVERY' : 'QR',
      };
      if (deliveryTab === 'delivery') body.shippingAddressId = selectedAddressId;

      const res = await api.post<{ data: { id: number } }>('/api/orders/checkout', body);
      const orderId = res.data.data?.id;

      clearCart();

      if (paymentTab === 'cod') {
        router.push('/order-success');
      } else {
        router.push(`/order/${orderId}/pay`);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No se pudo crear el pedido. Inténtalo de nuevo.';
      setOrderError(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      <div className="bg-[var(--bg-light)] py-4 px-4 sm:px-6 lg:px-20 flex justify-center border-b border-[var(--border-light)]">
        <ProgressSteps steps={['Envío', 'Pago', 'Revisión']} currentStep={1} />
      </div>

      <div className="px-4 sm:px-6 lg:px-20 py-6 lg:py-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="flex-1 space-y-8">
          <DeliverySection
            deliveryTab={deliveryTab}
            onDeliveryTabChange={setDeliveryTab}
            selectedAddressId={selectedAddressId}
            onAddressSelect={setSelectedAddressId}
            onShippingInfoChange={setShippingInfo}
          />
          <CheckoutPaymentSection
            paymentTab={paymentTab}
            onPaymentTabChange={setPaymentTab}
            isSameRegion={isSameRegion}
            orderError={orderError}
          />
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="sticky top-4">
            <OrderSummary
              onSubmit={handlePlaceOrder}
              buttonLabel={placingOrder ? 'Procesando…' : paymentTab === 'cod' ? 'Confirmar pedido' : 'Generar QR y pagar'}
              shippingCost={deliveryTab === 'delivery' ? (shippingInfo?.shippingCost ?? null) : 0}
              loadingShipping={false}
              disabled={placingOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
