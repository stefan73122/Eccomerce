'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { login } from '@/services/userService';
import Link from 'next/link';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useTheme } from '@/lib/theme/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  const loginUser = useUserStore((s) => s.login);
  const { theme } = useTheme();
  const { login: loginTheme, branding, colors } = theme;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, tokens } = await login({ email, password });
      loginUser(user, tokens);
      router.push('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        const message = data?.message || data?.error;
        if (err.response?.status === 401) {
          setError(message || 'Incorrect email or password.');
        } else if (err.response?.status === 400) {
          setError(message || 'Please check your credentials.');
        } else if (!err.response) {
          setError('Cannot connect to server. Please verify the server is running.');
        } else {
          setError(message || 'An unexpected error occurred.');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingBag size={28} style={{ color: colors.primary }} />
            <span className="text-xl font-bold tracking-[3px] text-[var(--text-dark)]">
              {branding.storeName}
            </span>
          </div>

          <h1 className="text-[28px] font-bold text-[var(--text-dark)] mb-2">Welcome back</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Sign in to your account to continue</p>

          {error && <p className="text-sm text-[var(--error)] mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[var(--border)] rounded-lg px-4 h-12 text-sm outline-none focus:border-[var(--primary)]"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-[var(--border)] rounded-lg px-4 h-12 text-sm outline-none focus:border-[var(--primary)] pr-10"
                  required
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <Link href="#" className="text-sm text-[var(--primary)] hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-white h-12 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)]">or continue with</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-[var(--border)] rounded-lg h-11 text-sm font-medium text-[var(--text-dark)] hover:bg-gray-50 transition">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-[var(--border)] rounded-lg h-11 text-sm font-medium text-[var(--text-dark)] hover:bg-gray-50 transition">
              Apple
            </button>
          </div>

          <p className="text-sm text-[var(--text-muted)] text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--primary)] font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div
        className="hidden lg:flex w-[480px] items-center justify-center bg-cover bg-center"
        style={
          loginTheme.backgroundType === 'image' && loginTheme.backgroundImageUrl
            ? { backgroundImage: `url(${loginTheme.backgroundImageUrl})` }
            : { backgroundColor: loginTheme.backgroundColor }
        }
      >
        <div className="text-center text-white px-12">
          <ShoppingBag size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl font-bold mb-3">Premium Products,<br />Wholesale Prices</h2>
          <p className="text-white/70 text-sm leading-relaxed">Access exclusive deals, track your orders, and manage your wishlist — all in one place.</p>
        </div>
      </div>
    </div>
  );
}
