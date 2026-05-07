'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { cn } from '@/lib/cn';

const tabs = [
  { id: 'terms', label: 'Terms of Service' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'shipping', label: 'Shipping Policy' },
  { id: 'returns', label: 'Returns & Exchanges' },
];

const content: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: '1. Acceptance of Terms', body: 'By accessing and using Storefront, you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not access or use our services.' },
      { heading: '2. Use of Service', body: 'You must be at least 18 years old to use our services. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.' },
      { heading: '3. Products & Pricing', body: 'All product descriptions and pricing are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Prices are in USD and do not include applicable taxes unless stated otherwise.' },
      { heading: '4. Orders & Payment', body: 'By placing an order, you are making an offer to purchase. We reserve the right to refuse or cancel any order. Payment must be received before order processing begins.' },
      { heading: '5. Intellectual Property', body: 'All content on this site including text, graphics, logos, and images is the property of Storefront and is protected by copyright laws. Unauthorized use is prohibited.' },
      { heading: '6. Limitation of Liability', body: 'Storefront shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or products.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. Information We Collect', body: 'We collect information you provide directly, such as name, email, address, and payment details when you create an account or make a purchase. We also collect usage data automatically.' },
      { heading: '2. How We Use Your Information', body: 'We use your information to process orders, communicate with you, improve our services, send promotional offers (with your consent), and comply with legal obligations.' },
      { heading: '3. Information Sharing', body: 'We do not sell your personal information. We may share data with service providers who assist in order fulfillment, payment processing, and analytics.' },
      { heading: '4. Data Security', body: 'We implement industry-standard security measures including SSL encryption and PCI-compliant payment processing to protect your personal information.' },
      { heading: '5. Your Rights', body: 'You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time.' },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    sections: [
      { heading: 'Standard Shipping', body: 'Free standard shipping on all orders. Delivery within 3-5 business days to all addresses in the continental United States.' },
      { heading: 'Express Shipping', body: 'Express shipping available for $9.99. Delivery within 1-2 business days. Available for most items and locations.' },
      { heading: 'In-Store Pickup', body: 'Free in-store pickup available at all Storefront locations. Orders are typically ready within 2 hours of confirmation.' },
      { heading: 'Order Tracking', body: 'All orders include tracking information sent via email once shipped. You can also track your order on our website using your order ID.' },
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    sections: [
      { heading: 'Return Window', body: 'We accept returns within 30 days of delivery. Items must be in original condition with all tags and packaging intact.' },
      { heading: 'How to Return', body: 'Initiate a return through your account or contact our support team. We will provide a prepaid return label for eligible items.' },
      { heading: 'Refund Processing', body: 'Refunds are processed within 5-7 business days after we receive the returned item. The refund will be credited to your original payment method.' },
      { heading: 'Exchanges', body: 'To exchange an item, return the original and place a new order. We recommend purchasing the replacement item immediately to ensure availability.' },
    ],
  },
};

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState('terms');
  const activeContent = content[activeTab];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms & Privacy' }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-6 lg:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-[220px] flex-shrink-0">
          <nav className="space-y-1 sticky top-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full text-left px-4 py-2.5 rounded-lg text-sm transition',
                  activeTab === tab.id
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:bg-gray-50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <h1 className="text-[28px] font-bold text-[var(--text-dark)] mb-2">{activeContent.title}</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: January 1, 2026</p>

          <div className="space-y-8">
            {activeContent.sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-lg font-semibold text-[var(--text-dark)] mb-2">{section.heading}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
