// ==============================================================================
// ShopSphere AI — Curated Editorial Products Data & Catalog Service
// ==============================================================================

import type { Product, CategoryItem } from '@/types';
import { productsApi } from './api/products';

export const CURATED_CATEGORIES: CategoryItem[] = [
  { slug: 'all', name: 'All Collections', url: '/shop' },
  { slug: 'acoustics', name: 'Precision Acoustics', url: '/shop?category=acoustics' },
  { slug: 'timepieces', name: 'Modern Horology', url: '/shop?category=timepieces' },
  { slug: 'apparel', name: 'Atelier Outerwear', url: '/shop?category=apparel' },
  { slug: 'living', name: 'Architectural Living', url: '/shop?category=living' },
  { slug: 'carry', name: 'Minimalist Carry', url: '/shop?category=carry' },
  { slug: 'optical', name: 'Optical & Tech', url: '/shop?category=optical' },
];

export const CURATED_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Aura Studio Wireless ANC',
    description: 'Reference-grade wireless over-ear monitors with adaptive active noise cancellation, custom 40mm titanium acoustic drivers, and 38-hour battery longevity.',
    category: 'acoustics',
    price: 299,
    discountPercentage: 14.3,
    rating: 4.9,
    stock: 24,
    brand: 'Aura Sound Labs',
    warrantyInformation: '2-year international warranty',
    shippingInformation: 'Free express 2-day delivery',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Acoustics', 'Wireless', 'ANC', 'Titanium'],
    returnPolicy: '30-day effortless return guarantee',
  },
  {
    id: 2,
    title: 'Chronos Obsidian 42mm',
    description: 'Minimalist automatic timepiece housed in surgical-grade 316L stainless steel with midnight black PVD coating, sapphire crystal, and exhibition caseback.',
    category: 'timepieces',
    price: 349,
    discountPercentage: 16.9,
    rating: 4.8,
    stock: 18,
    brand: 'Chronos Atelier',
    warrantyInformation: '5-year movement warranty',
    shippingInformation: 'Free insured global shipping',
    availabilityStatus: 'Low Stock',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Horology', 'Automatic', 'Obsidian', 'Limited'],
    returnPolicy: '30-day return policy',
  },
  {
    id: 3,
    title: 'Voyager Weekender Carryall',
    description: 'Handcrafted full-grain saddle leather duffle with water-resistant ballistic nylon lining, dedicated laptop compartment, and solid brass hardware.',
    category: 'carry',
    price: 185,
    discountPercentage: 15.9,
    rating: 4.9,
    stock: 32,
    brand: 'Voyager Goods',
    warrantyInformation: 'Lifetime craftsmanship guarantee',
    shippingInformation: 'Dispatched within 24 hours',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Leather', 'Travel', 'Handmade', 'Carry'],
    returnPolicy: '30-day effortless return guarantee',
  },
  {
    id: 4,
    title: 'Nordic Sculptural Desk Luminaire',
    description: 'Warm textured stoneware ceramic lamp with hand-blown frosted glass diffuser, touch-capacitive 3-stage dimming, and ambient warm LED core.',
    category: 'living',
    price: 145,
    discountPercentage: 17.1,
    rating: 4.7,
    stock: 15,
    brand: 'Nordic Form',
    warrantyInformation: '3-year hardware warranty',
    shippingInformation: 'Fragile insured courier shipping',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Ceramic', 'Nordic', 'Lighting', 'Architectural'],
    returnPolicy: '30-day effortless return guarantee',
  },
  {
    id: 5,
    title: 'Aerospace Titanium Monolith',
    description: 'Precision-milled aerospace grade-5 titanium sunglasses with Zeiss polarized lenses, 100% UVA/UVB filtering, and zero-distortion optical clarity.',
    category: 'optical',
    price: 240,
    discountPercentage: 17.2,
    rating: 4.9,
    stock: 20,
    brand: 'Monolith Optics',
    warrantyInformation: '2-year scratch and frame warranty',
    shippingInformation: 'Express delivery included',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Titanium', 'Zeiss', 'Polarized', 'Optics'],
    returnPolicy: '30-day return policy',
  },
  {
    id: 6,
    title: 'Urban All-Weather Stealth Shell',
    description: 'Engineered 3-layer weatherproof breathable membrane jacket with seam-sealed construction, magnetic hood cinches, and concealed ergonomic utility pockets.',
    category: 'apparel',
    price: 275,
    discountPercentage: 15.4,
    rating: 4.8,
    stock: 28,
    brand: 'Atelier Technical',
    warrantyInformation: 'Lifetime waterproof guarantee',
    shippingInformation: 'Dispatched within 24 hours',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Weatherproof', 'Technical', 'Outerwear', 'Atelier'],
    returnPolicy: '30-day effortless return guarantee',
  },
  {
    id: 7,
    title: 'Sonar Acoustic Desktop Hub',
    description: 'Dual acoustic driver passive radiator desk monitor with walnut veneer casing, balanced 4.4mm outputs, and studio master gain calibration.',
    category: 'acoustics',
    price: 380,
    discountPercentage: 10.5,
    rating: 4.9,
    stock: 12,
    brand: 'Aura Sound Labs',
    warrantyInformation: '3-year acoustic warranty',
    shippingInformation: 'Express delivery included',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Acoustics', 'Walnut', 'Studio', 'Desktop'],
    returnPolicy: '30-day return policy',
  },
  {
    id: 8,
    title: 'Merino Wool Architectural Cardigan',
    description: 'Spun from 19.5-micron ultra-fine Australian merino wool with seamless knit structure, mother-of-pearl horn buttons, and relaxed tailored drape.',
    category: 'apparel',
    price: 195,
    discountPercentage: 12.8,
    rating: 4.7,
    stock: 22,
    brand: 'Atelier Technical',
    warrantyInformation: '1-year knitwear warranty',
    shippingInformation: 'Dispatched within 24 hours',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Merino', 'Apparel', 'Knitwear', 'Luxury'],
    returnPolicy: '30-day return policy',
  },
  {
    id: 9,
    title: 'Sculptural Sandstone Vessel',
    description: 'Hand-carved architectural sandstone vessel with raw mineral exterior and sealed satin interior for dried botanicals and minimalist arrangements.',
    category: 'living',
    price: 120,
    discountPercentage: 10.0,
    rating: 4.8,
    stock: 19,
    brand: 'Nordic Form',
    warrantyInformation: 'Safe arrival guarantee',
    shippingInformation: 'Custom foam packaging',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Sculpture', 'Sandstone', 'Living', 'Art'],
    returnPolicy: '30-day return policy',
  },
  {
    id: 10,
    title: 'Equinox Chronograph Automatic',
    description: 'Precision chronograph with 48-hour power reserve, tachymeter bezel, integrated mesh titanium bracelet, and luminous indices.',
    category: 'timepieces',
    price: 490,
    discountPercentage: 15.0,
    rating: 4.9,
    stock: 8,
    brand: 'Chronos Atelier',
    warrantyInformation: '5-year international warranty',
    shippingInformation: 'Signature required delivery',
    availabilityStatus: 'Low Stock',
    thumbnail: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Chronograph', 'Horology', 'Titanium', 'Precision'],
    returnPolicy: '30-day return policy',
  },
  {
    id: 11,
    title: 'Atelier Crossbody Utility Folio',
    description: 'Structured vegetable-tanned leather organizer with magnetic Fidlock clasp, modular pen loops, and RFID-shielded card slots.',
    category: 'carry',
    price: 135,
    discountPercentage: 14.8,
    rating: 4.8,
    stock: 35,
    brand: 'Voyager Goods',
    warrantyInformation: 'Lifetime guarantee',
    shippingInformation: 'Dispatched within 24 hours',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Folio', 'Leather', 'Carry', 'RFID'],
    returnPolicy: '30-day return policy',
  },
  {
    id: 12,
    title: 'Prism Polarized Studio Eyewear',
    description: 'Ultra-thin Japanese acetate frames with photochromic blue-light blocking lenses and reinforced five-barrel barrel hinges.',
    category: 'optical',
    price: 180,
    discountPercentage: 11.1,
    rating: 4.7,
    stock: 24,
    brand: 'Monolith Optics',
    warrantyInformation: '2-year warranty',
    shippingInformation: 'Free express delivery',
    availabilityStatus: 'In Stock',
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
    ],
    tags: ['Acetate', 'BlueLight', 'Eyewear', 'Optical'],
    returnPolicy: '30-day return policy',
  },
];

/**
 * Fetch products with seamless fallback:
 * Queries DummyJSON when available, merges with curated items or falls back instantly.
 */
export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const res = await productsApi.getProducts({ limit: 12 });
    if (res && res.products && res.products.length > 0) {
      // Merge or return curated products first, followed by external products
      const existingIds = new Set(CURATED_PRODUCTS.map((p) => p.id));
      const externalFiltered = res.products.filter((p) => !existingIds.has(p.id));
      return [...CURATED_PRODUCTS, ...externalFiltered];
    }
  } catch {
    // Network or API unavailable; gracefully use curated local dataset
  }
  return CURATED_PRODUCTS;
}

export function getProductById(id: number): Product | undefined {
  return CURATED_PRODUCTS.find((p) => p.id === id);
}
