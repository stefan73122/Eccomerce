'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/axios';

interface QrData {
  order: string;
  imageQR: string;
  status: string;
  dueDate: string;
}

interface QRPaymentProps {
  orderId: number;
}

const POLL_INTERVAL_MS = 3000;

function getRemainingSeconds(dueDate: string): number {
  return Math.max(0, Math.floor((new Date(dueDate).getTime() - Date.now()) / 1000));
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function QRPayment({ orderId }: QRPaymentProps) {
  const router = useRouter();
  const [qrData, setQrData] = useState<QrData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('PENDING');
  const [countdown, setCountdown] = useState<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  };

  const confirmAndRedirect = async () => {
    try {
      await api.post(`/api/orders/${orderId}/pay/confirm`);
    } catch {
      // silent — redirect regardless
    }
    router.push('/order-success');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pollStatus = async () => {
    try {
      const res = await api.get<{ data: { data: { status: string } } }>(`/api/orders/${orderId}/pay/status`);
      const newStatus = res.data.data?.data?.status ?? 'PENDING';
      setStatus(newStatus);
      if (newStatus === 'PAID') {
        stopPolling();
        confirmAndRedirect();
      } else if (newStatus === 'EXPIRED' || newStatus === 'ERROR') {
        stopPolling();
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post<{ data: { qr: { data: QrData } } }>(`/api/orders/${orderId}/pay`);
        if (cancelled) return;
        const qr = res.data.data?.qr?.data;
        setQrData(qr);
        setStatus(qr.status);
        setCountdown(getRemainingSeconds(qr.dueDate));

        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
            return prev - 1;
          });
        }, 1000);

        pollRef.current = setInterval(pollStatus, POLL_INTERVAL_MS);
      } catch (err: any) {
        if (cancelled) return;
        const msg = err?.response?.data?.message || 'No se pudo generar el código QR.';
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
        <p className="text-sm text-[var(--text-muted)]">Generando código QR…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <XCircle size={32} className="text-red-500" />
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
        >
          <RefreshCw size={14} /> Reintentar
        </button>
      </div>
    );
  }

  if (status === 'PAID') {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <CheckCircle2 size={40} className="text-green-500" />
        <p className="text-base font-semibold text-green-700">¡Pago confirmado!</p>
        <p className="text-sm text-[var(--text-muted)]">Redirigiendo…</p>
      </div>
    );
  }

  if (status === 'EXPIRED' || status === 'ERROR') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <XCircle size={32} className="text-red-400" />
        <p className="text-sm text-red-600 font-medium">
          {status === 'EXPIRED' ? 'El código QR ha expirado.' : 'Ocurrió un error con el pago.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
        >
          <RefreshCw size={14} /> Generar nuevo QR
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {qrData?.imageQR && (
        <div className="border-2 border-[var(--border)] rounded-xl p-3 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${qrData.imageQR}`}
            alt="Código QR de pago"
            className="w-[200px] h-[200px] object-contain"
          />
        </div>
      )}
      <div className="text-center space-y-1">
        <p className="text-sm text-[var(--text-muted)]">
          Escanea con tu app bancaria para completar el pago
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Expira en{' '}
          <span className={`font-semibold tabular-nums ${countdown < 60 ? 'text-red-500' : 'text-[var(--text-dark)]'}`}>
            {formatCountdown(countdown)}
          </span>
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] mt-1">
          <Loader2 size={11} className="animate-spin" />
          Verificando pago automáticamente…
        </div>
      </div>
    </div>
  );
}
