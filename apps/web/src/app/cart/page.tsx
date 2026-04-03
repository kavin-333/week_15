"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="h-20 w-20 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-[#6C63FF]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Looks like you haven&apos;t added any products yet. Browse our
          collection and find something you love!
        </p>
        <Link href="/products">
          <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] rounded-xl px-6">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-muted-foreground mb-8">
        {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="glass rounded-2xl p-4 flex gap-4"
            >
              {}
              <Link
                href={`/products/${item.productId}`}
                className="shrink-0"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              </Link>

              {}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-semibold hover:text-[#6C63FF] transition-smooth line-clamp-1"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-smooth shrink-0"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {}
                  <div className="flex items-center bg-white/5 rounded-xl">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-2 hover:bg-white/5 rounded-l-xl transition-smooth"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-2 hover:bg-white/5 rounded-r-xl transition-smooth"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {}
                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-400">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="bg-white/5 my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-muted-foreground mb-4 text-center">
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}

            <Link href="/checkout">
              <Button
                className="w-full bg-[#FF6584] hover:bg-[#E5567A] text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-[#FF6584]/30 transition-all duration-300"
                id="checkout-button"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/products" className="block mt-3">
              <Button
                variant="ghost"
                className="w-full rounded-xl hover:bg-white/5"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
