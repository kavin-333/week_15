"use client";

import { useState, useMemo } from "react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("latest");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [displayLimit, setDisplayLimit] = useState(12);

  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === selectedCategory ||
          p.category.toLowerCase() === selectedCategory
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    filtered = filtered.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "latest":
      default:
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, maxPrice]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayLimit);
  }, [filteredProducts, displayLimit]);

  const filterContent = (
    <div className="space-y-8">
      {}
      <div>
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              selectedCategory === "all"
                ? "bg-[#6C63FF] hover:bg-[#5A52E0] text-white shadow-md shadow-[#6C63FF]/20 border-transparent"
                : "bg-white/5 hover:bg-white/10 text-muted-foreground border border-white/10"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Badge>
          {categories?.map((cat) => (
            <Badge
              key={cat.id}
              className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                selectedCategory === cat.slug
                  ? "bg-[#6C63FF] hover:bg-[#5A52E0] text-white shadow-md shadow-[#6C63FF]/20 border-transparent"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground border border-white/10"
              }`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {}
      <div>
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground flex justify-between">
          <span>Max Price</span>
          <span className="text-white">${maxPrice}</span>
        </h3>
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF6584]"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>$0</span>
          <span>$1000+</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      {}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Shop All</h1>
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {}
          <div className="relative flex-1 w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 rounded-xl w-full focus:border-[#6C63FF]/50"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {}
            <Sheet>
              <SheetTrigger render={<Button variant="outline" className="flex-1 md:hidden bg-white/5 border-white/10 hover:bg-white/10 rounded-xl gap-2 font-medium" />}>
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl bg-[#0F0F0F] border-t-white/10 pt-8 px-6">
                <SheetHeader>
                  <SheetTitle className="text-left mb-6 text-2xl font-bold">Filters</SheetTitle>
                </SheetHeader>
                {filterContent}
              </SheetContent>
            </Sheet>

            {}
            <div className="w-full sm:w-48">
               <Select value={sortBy} onValueChange={(val) => setSortBy(val ?? "latest")}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 rounded-xl hover:bg-white/10 transition-colors font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10 rounded-xl">
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 glass rounded-3xl p-6">
            {filterContent}
          </div>
        </aside>

        {}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl overflow-hidden animate-pulse h-[350px]"
                >
                  <div className="h-[200px] bg-white/5" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-5 bg-white/5 rounded w-2/3" />
                    <div className="h-6 bg-white/5 rounded w-1/2 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl max-w-xl mx-auto">
              <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mb-2">No products found</p>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setMaxPrice(1000);
                }}
                className="bg-[#6C63FF] hover:bg-[#5A52E0] rounded-xl px-6 h-11 shadow-lg shadow-[#6C63FF]/20 text-white font-medium"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {}
              {filteredProducts.length > displayLimit && (
                <div className="mt-12 flex justify-center">
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-white/10 hover:bg-white/10 px-8 h-12 font-medium"
                    onClick={() => setDisplayLimit(prev => prev + 12)}
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 bg-white/5 rounded w-48 mb-4 animate-pulse" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
