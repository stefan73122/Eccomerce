'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { register } from '@/services/userService';
import Link from 'next/link';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const loginUser = useUserStore((s) => s.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { user, tokens } = await register({ name, email, password, phone: phone || undefined });
      loginUser(user, tokens);
      router.push('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        if (!err.response) {
          setError('Cannot connect to server. Please verify the server is running.');
        } else if (data?.errors && Array.isArray(data.errors)) {
          const messages = data.errors
            .map((e: { message?: string; errors?: string[] }) => e.errors?.join(', ') || e.message || '')
            .filter(Boolean)
            .join('. ');
          setError(messages || 'Registration failed. Please try again.');
        } else if (err.response?.status === 409) {
          setError(data?.message || 'An account with this email already exists.');
        } else {
          setError(data?.message || 'Registration failed. Please try again.');
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
      {/* Left - Visual */}
      <div className="hidden lg:flex w-[480px] bg-[var(--primary)] items-center justify-center">
        <div className="text-center text-white px-12">
          <ShoppingBag size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl font-bold mb-3">Join Storefront<br />Today</h2>
          <p className="text-white/70 text-sm leading-relaxed">Create an account to enjoy exclusive deals, save your favorites, and get a personalized shopping experience.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-md">
          <h1 className="text-[28px] font-bold text-[var(--text-dark)] mb-2">Create Account</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Join us and start shopping today</p>

          {error && <p className="text-sm text-[var(--error)] mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-[var(--border)] rounded-lg px-4 h-12 text-sm outline-none focus:border-[var(--primary)]"
                required
                disabled={loading}
              />
            </div>
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
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Phone <span className="text-[var(--text-muted)] font-normal">(optional)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full border border-[var(--border)] rounded-lg px-4 h-12 text-sm outline-none focus:border-[var(--primary)]"
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
                  placeholder="Create a password"
                  className="w-full border border-[var(--border)] rounded-lg px-4 h-12 text-sm outline-none focus:border-[var(--primary)] pr-10"
                  required
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-placeholder)]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full border border-[var(--border)] rounded-lg px-4 h-12 text-sm outline-none focus:border-[var(--primary)]"
                required
                disabled={loading}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] cursor-pointer">
              <input type="checkbox" className="rounded" required /> I agree to the{' '}
              <Link href="/terms" className="text-[var(--primary)] hover:underline">Terms of Service</Link>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-white h-12 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)]">or sign up with</span>
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
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
