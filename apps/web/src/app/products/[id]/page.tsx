"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  Star,
  ShoppingCart,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-white/5 rounded w-1/3 animate-pulse" />
            <div className="h-8 bg-white/5 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/products">
          <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] rounded-xl text-white font-medium">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const images = product.images || [product.image];
  const relatedProducts = allProducts
    ?.filter(
      (p) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 6);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("Product is out of stock!");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      toast.error("Product is out of stock!");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2 opacity-50 text-xs" />
        <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-white transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 opacity-50 text-xs" />
        <span className="text-white font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden glass bg-[#111122]">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {discount && (
              <Badge className="absolute top-4 left-4 bg-[#FF6584] text-white border-0 text-sm font-semibold rounded-lg px-3 py-1">
                -{discount}% OFF
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-smooth ${
                    i === selectedImage
                      ? "border-[#6C63FF]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {product.name}
          </h1>

          {/* Rating & Stock */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium ml-1">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
            
            <Separator orientation="vertical" className="h-5 hidden sm:block bg-white/20" />
            
            <Badge 
              variant="outline" 
              className={`border-0 text-sm font-semibold px-3 py-1 rounded-xl ${
                product.inStock ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#FF6584]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10">
            {product.description}
          </p>

          <Separator className="bg-white/10 mb-8" />

          {/* Actions */}
          <div className="space-y-4 mb-10">
            {/* Quantity */}
            <div className="flex items-center glass rounded-xl w-fit border border-white/5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-4 hover:bg-white/5 rounded-l-xl transition-colors disabled:opacity-50"
                disabled={!product.inStock}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 text-lg font-bold min-w-[4rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-4 hover:bg-white/5 rounded-r-xl transition-colors disabled:opacity-50"
                disabled={!product.inStock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl h-14 text-lg font-semibold shadow-lg shadow-[#6C63FF]/30 transition-all duration-300"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                variant="outline"
                className="w-full border-white/20 hover:bg-white/5 rounded-xl h-14 text-lg font-semibold transition-all duration-300"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-auto">
            {[
              { icon: Truck, label: "Free Shipping", desc: "Over $50" },
              { icon: Shield, label: "Warranty", desc: "2 Year" },
              { icon: RotateCcw, label: "Returns", desc: "30 Days" },
            ].map((feat) => (
              <div
                key={feat.label}
                className="glass rounded-2xl p-4 text-center border-white/5 hover:bg-white/5 transition-colors"
              >
                <feat.icon className="h-6 w-6 mx-auto mb-2 text-[#FF6584]" />
                <p className="text-sm font-semibold mb-1">{feat.label}</p>
                <p className="text-xs text-muted-foreground">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products - Horizontal Scroll */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">You May Also Like</h2>
            <Link href={`/products?category=${product.category.toLowerCase()}`} className="text-[#6C63FF] font-medium hover:text-[#5A52E0] flex items-center gap-1 transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {relatedProducts.map((p) => (
              <div key={p.id} className="min-w-[280px] w-[80vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
