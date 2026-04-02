import { Product, Category } from "@/types/database";

export const categories: Category[] = [
  { id: "1", name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop", productCount: 24 },
  { id: "2", name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop", productCount: 36 },
  { id: "3", name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", productCount: 18 },
  { id: "4", name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop", productCount: 12 },
  { id: "5", name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop", productCount: 42 },
  { id: "6", name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop", productCount: 28 },
];

const baseProducts: Omit<Product, "id">[] = [
  { name: "Wireless Headphones", description: "Premium noise-cancelling headphones.", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop", category: "Electronics", rating: 4.8, reviewCount: 120, inStock: true, featured: true },
  { name: "Luxury Watch", description: "Elegant timepiece with leather strap.", price: 199.0, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop", category: "Fashion", rating: 4.6, reviewCount: 85, inStock: true, featured: true },
  { name: "Smart Speaker", description: "AI-powered home assistant.", price: 129.0, image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=600&fit=crop", category: "Electronics", rating: 4.5, reviewCount: 210, inStock: true },
  { name: "Yoga Mat", description: "Eco-friendly non-slip yoga mat.", price: 49.99, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop", category: "Sports", rating: 4.7, reviewCount: 64, inStock: true },
  { name: "Skincare Set", description: "Organic facial care kit.", price: 89.99, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop", category: "Beauty", rating: 4.9, reviewCount: 150, inStock: true },
  { name: "Coffee Table Book", description: "Architectural photography collection.", price: 59.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop", category: "Books", rating: 4.4, reviewCount: 32, inStock: true },
  { name: "Office Chair", description: "Ergonomic mesh chair.", price: 349.0, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop", category: "Home & Living", rating: 4.7, reviewCount: 98, inStock: true },
  { name: "Running Shoes", description: "Lightweight performance sneakers.", price: 129.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop", category: "Sports", rating: 4.8, reviewCount: 187, inStock: true },
  { name: "Silk Scarf", description: "100% pure silk floral scarf.", price: 45.0, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop", category: "Fashion", rating: 4.8, reviewCount: 34, inStock: true },
  { name: "Denim Jacket", description: "Classic fit vintage wash jacket.", price: 79.99, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop", category: "Fashion", rating: 4.5, reviewCount: 78, inStock: true },
];

const generateProducts = (count: number): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= count; i++) {
    const base = baseProducts[(i - 1) % baseProducts.length];
    const categorySuffix = i % 2 === 0 ? " Pro" : " Ultra";
    products.push({
      ...base,
      id: i.toString(),
      name: `${base.name} ${i > 10 ? `#${i}` : categorySuffix}`,
      price: Number((base.price + (Math.sin(i) * 20)).toFixed(2)), // Dynamic price
      rating: Number((4 + Math.random()).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 10,
    } as Product);
  }
  return products;
};

export const products = generateProducts(100);
