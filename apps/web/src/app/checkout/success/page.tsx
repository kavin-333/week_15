"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { createClient } from "@/lib/supabase/client";

export default function OrderSuccessPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [orderId, setOrderId] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(true);

  useEffect(() => {
    const saveOrder = async () => {
      if (items.length === 0) {
        setIsSaving(false);
        setMounted(true);
        return;
      }

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        setIsSaving(false);
        setMounted(true);
        return;
      }

      const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
      
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: "confirmed",
          shipping_address: {}, // Would normally come from checkout state
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error saving order:", orderError);
        setIsSaving(false);
        setMounted(true);
        return;
      }

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error saving order items:", itemsError);
      }

      setOrderId(order.id.slice(0, 8).toUpperCase()); // Show first 8 chars of actual UUID
      setIsSaving(false);
      setMounted(true);
      clearCart();
    };

    saveOrder();
  }, [items, clearCart]);

  if (!mounted) return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#6C63FF]" />
    </div>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass rounded-3xl p-8 sm:p-12 text-center animate-in zoom-in-95 duration-500">
        
        {}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-75" />
          <div className="relative flex items-center justify-center w-full h-full bg-emerald-500/20 text-emerald-400 rounded-full border-2 border-emerald-500/30">
            <Check className="w-12 h-12 animate-in slide-in-from-bottom-2 zoom-in-50 duration-700 delay-150" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Order Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. We&apos;ve correctly received your order and are getting it ready to be shipped.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
          <p className="text-sm text-muted-foreground mb-1">Order Reference ID</p>
          <p className="text-lg font-mono font-bold text-emerald-400">{orderId}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-8 flex items-center justify-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          A confirmation email has been sent to your inbox.
        </p>

        <Link href="/products" className="block">
          <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl h-14 text-lg font-bold shadow-lg shadow-[#6C63FF]/30 transition-all duration-300">
            Continue Shopping
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
