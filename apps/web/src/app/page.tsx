"use client";

import { useProducts, useCategories } from "@/hooks/useProducts";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const featuredProducts = products?.filter((p) => p.featured) ?? [];

  return (
    <div>
      {}
      <HeroSection />

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#6C63FF]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
              <p className="text-sm text-muted-foreground">
                Handpicked just for you
              </p>
            </div>
          </div>
          <Link href="/products">
            <Button
              variant="ghost"
              className="text-[#6C63FF] hover:bg-[#6C63FF]/10 rounded-xl"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="glass rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-[#FF6584]/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-[#FF6584]" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Shop by Category
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse our curated collections
            </p>
          </div>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl glass p-8 sm:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C63FF]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6584]/15 rounded-full blur-[80px]" />

          <div className="relative text-center max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-6">
              Get exclusive deals, new arrivals, and style tips delivered to your
              inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#6C63FF]/50 transition-smooth"
              />
              <Button className="bg-[#FF6584] hover:bg-[#E5567A] text-white rounded-xl px-6 py-3 font-semibold shadow-lg shadow-[#FF6584]/30 transition-smooth">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
