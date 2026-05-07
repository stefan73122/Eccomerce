'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  return (
    <section className="mx-4 sm:mx-6 lg:mx-20 my-10">
      <div className="bg-[var(--primary)] rounded-2xl p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="text-center lg:text-left">
          <h3 className="text-xl lg:text-2xl font-bold text-white">Subscribe to our newsletter</h3>
          <p className="text-sm text-white/80 mt-1">Get the latest deals and updates delivered to your inbox</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:w-[300px] h-11 px-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 text-sm outline-none focus:border-white/60"
          />
          <button className="h-11 px-6 rounded-lg bg-white text-[var(--primary)] font-semibold text-sm hover:bg-white/90 transition">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
