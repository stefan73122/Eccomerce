'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import StoreMap from '@/components/store/StoreMap';
import { FAQ_ITEMS } from '@/data/constants';
import { cn } from '@/lib/cn';
import { MessageCircle, Mail, Phone, MapPin, ChevronDown, ChevronUp, Send } from 'lucide-react';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact & Support' }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-10">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-[var(--text-dark)]">Contact & Support</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">We&apos;re here to help. Reach out through any of these channels.</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 text-center hover:shadow-md transition">
            <div className="w-14 h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-[#25D366]" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-dark)] mb-1">WhatsApp</h3>
            <p className="text-sm text-[var(--text-muted)]">Chat with us instantly</p>
            <p className="text-sm font-medium text-[#25D366] mt-2">+1 (555) 123-4567</p>
          </div>

          <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 text-center hover:shadow-md transition">
            <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-[var(--primary)]" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-dark)] mb-1">Email</h3>
            <p className="text-sm text-[var(--text-muted)]">Get a response within 24 hours</p>
            <p className="text-sm font-medium text-[var(--primary)] mt-2">hello@storefront.com</p>
          </div>

          <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 text-center hover:shadow-md transition">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Phone size={24} className="text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-dark)] mb-1">Phone</h3>
            <p className="text-sm text-[var(--text-muted)]">Mon-Fri, 9AM-6PM EST</p>
            <p className="text-sm font-medium text-blue-500 mt-2">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Name</label>
                  <input placeholder="Your name" className="w-full border border-[var(--border)] rounded-lg px-3 h-11 text-sm outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Email</label>
                  <input placeholder="your@email.com" className="w-full border border-[var(--border)] rounded-lg px-3 h-11 text-sm outline-none focus:border-[var(--primary)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Subject</label>
                <input placeholder="How can we help?" className="w-full border border-[var(--border)] rounded-lg px-3 h-11 text-sm outline-none focus:border-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Message</label>
                <textarea placeholder="Tell us more..." rows={5} className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-[var(--primary)]" />
              </div>
              <button className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2">
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, idx) => (
                <div key={idx} className="border border-[var(--border-light)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                  >
                    <span className="text-sm font-medium text-[var(--text-dark)]">{faq.question}</span>
                    {openFaq === idx ? <ChevronUp size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HQ Map */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-4">Our Headquarters</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <StoreMap className="flex-1 h-[250px]" />
            <div className="w-full lg:w-[300px] flex flex-col justify-center space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--primary)] mt-0.5" />
                <p className="text-sm text-[var(--text-muted)]">123 Store St, New York, NY 10001</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[var(--primary)] mt-0.5" />
                <p className="text-sm text-[var(--text-muted)]">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[var(--primary)] mt-0.5" />
                <p className="text-sm text-[var(--text-muted)]">hello@storefront.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
