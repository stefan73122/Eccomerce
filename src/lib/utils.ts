export function formatPrice(price: number): string {
  const symbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? 'Bs.';
  return `${symbol} ${price.toFixed(2)}`;
}

export function formatDiscount(original: number, current: number): string {
  const discount = Math.round(((original - current) / original) * 100);
  return `${discount}% OFF`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
