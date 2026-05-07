import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Home Accessories',
    slug: 'home-accessories',
    icon: 'lamp',
    description: 'Elevate your living space with premium home accessories.',
    productCount: 42,
    subcategories: [
      { name: 'Lighting', slug: 'lighting' },
      { name: 'Decor', slug: 'decor' },
      { name: 'Storage', slug: 'storage' },
    ],
  },
  {
    id: '2',
    name: 'Watches',
    slug: 'watches',
    icon: 'watch',
    description: 'Swiss precision meets timeless design.',
    productCount: 36,
    subcategories: [
      { name: 'Analog', slug: 'analog' },
      { name: 'Digital', slug: 'digital' },
      { name: 'Smart Watches', slug: 'smart-watches' },
    ],
  },
  {
    id: '3',
    name: 'Water Bottles',
    slug: 'water-bottles',
    icon: 'cup-soda',
    description: 'Stay hydrated with style.',
    productCount: 28,
    subcategories: [
      { name: 'Insulated', slug: 'insulated' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Glass', slug: 'glass' },
    ],
  },
  {
    id: '4',
    name: 'Headphones',
    slug: 'headphones',
    icon: 'headphones',
    description: 'Immersive audio for every lifestyle.',
    productCount: 31,
    subcategories: [
      { name: 'Over-ear', slug: 'over-ear' },
      { name: 'In-ear', slug: 'in-ear' },
      { name: 'Wireless', slug: 'wireless' },
    ],
  },
  {
    id: '5',
    name: 'More Products',
    slug: 'more-products',
    icon: 'package',
    description: 'Discover our complete product range.',
    productCount: 55,
    subcategories: [
      { name: 'Chargers', slug: 'chargers' },
      { name: 'Speakers', slug: 'speakers' },
      { name: 'Bags', slug: 'bags' },
    ],
  },
];
