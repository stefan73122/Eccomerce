import Link from 'next/link';
import {
  ShoppingBag,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import {
  APP_NAME,
  FOOTER_QUICK_LINKS,
  FOOTER_CUSTOMER_SERVICE,
  PAYMENT_METHODS,
} from '@/data/constants';

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--footer-dark)]">
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-20 pb-6 pt-10">
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-[var(--primary)]" size={24} />
              <span className="text-lg font-bold tracking-[3px] text-white">{APP_NAME}</span>
            </div>
            <p className="max-w-[280px] text-[13px] leading-relaxed text-[var(--footer-text)]">
              Your one-stop destination for premium products. We bring you curated collections of watches, electronics, accessories and more at competitive prices with fast regional delivery.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="text-[var(--footer-text)] hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-[var(--footer-text)] hover:text-white transition"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-[var(--footer-text)] hover:text-white transition"><Instagram size={20} /></a>
              <a href="#" aria-label="YouTube" className="text-[var(--footer-text)] hover:text-white transition"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {FOOTER_QUICK_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="text-[13px] text-[var(--footer-text)] hover:text-white transition">{link.label}</Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white">Customer Service</h4>
            <nav className="flex flex-col gap-3">
              {FOOTER_CUSTOMER_SERVICE.map((link) => (
                <Link key={link.label} href={link.href} className="text-[13px] text-[var(--footer-text)] hover:text-white transition">{link.label}</Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Mail className="text-[var(--footer-text)]" size={16} />
                <span className="text-[13px] text-[var(--footer-text)]">hello@storefront.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-[var(--footer-text)]" size={16} />
                <span className="text-[13px] text-[var(--footer-text)]">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[var(--footer-text)]" size={16} />
                <span className="text-[13px] text-[var(--footer-text)]">123 Store St, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="text-[#25D366]" size={16} />
                <span className="text-[13px] font-medium text-[#25D366]">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[var(--footer-divider)]" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">&copy; 2026 Storefront. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-[var(--text-muted)] hover:text-[var(--footer-text)] transition">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-[var(--text-muted)] hover:text-[var(--footer-text)] transition">Terms of Service</Link>
          </div>
        </div>

        {/* Payment */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-[11px] font-medium text-[var(--text-muted)]">Accepted Payments:</span>
          {PAYMENT_METHODS.map((method) => (
            <span key={method} className="rounded border border-[var(--footer-divider)] px-2.5 py-1 text-[10px] font-semibold text-[var(--footer-text)]">{method}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
