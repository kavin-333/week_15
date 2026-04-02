"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/database";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast.error("Product is out of stock!");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="group block relative w-full h-full">
      <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#6C63FF]/10 hover:border-[#6C63FF]/20 flex flex-col h-full bg-[#111122]">
        
        {/* Image Container */}
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-white/5 shrink-0 block">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <span className="text-white font-bold text-lg border-2 border-white/20 px-4 py-2 rounded-xl bg-black/40 rotate-12">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Wishlist Heart Top Right */}
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 h-9 w-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#FF6584] text-[#FF6584]' : 'text-white'}`} />
        </button>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category Badge */}
          <div className="mb-2">
            <Badge variant="outline" className="border-white/10 text-xs font-medium text-muted-foreground bg-white/5 hover:bg-white/10 transition-colors">
              {product.category}
            </Badge>
          </div>
          
          {/* Name */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-base line-clamp-2 mb-2 hover:text-[#6C63FF] transition-smooth cursor-pointer">
              {product.name}
            </h3>
          </Link>

          <div className="min-h-[24px]" />

          {/* Price & Add to Cart Container */}
          <div className="mt-auto space-y-4">
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.inStock && (
              <Button
                onClick={handleAddToCart}
                className="w-full h-11 bg-[#6C63FF] hover:bg-[#5A52E0] text-white shadow-lg shadow-[#6C63FF]/30 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
