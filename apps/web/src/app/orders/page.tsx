"use client";

import Image from "next/image";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types/database";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-0">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-orange-500/10 text-orange-400 border-0">Shipped</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500/10 text-blue-400 border-0">Confirmed</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-0">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 bg-white/5 w-48 rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your order history.</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-3">No orders found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            It looks like you haven&apos;t placed any orders yet. Start shopping to fill your history!
          </p>
          <Link href="/products">
            <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl px-8">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order: Order) => (
            <div key={order.id} className="glass rounded-3xl p-6 sm:p-8 hover:border-white/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6C63FF]/30 group-hover:bg-[#6C63FF] transition-colors" />
              
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-mono text-[#6C63FF] font-bold">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {order.items?.map((item, idx: number) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-white/5">
                        <Image
                          src={item.product.image || "/placeholder-product.png"}
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-[#6C63FF] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1A1A2E]">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col justify-between items-end gap-4 min-w-[150px]">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-white">${Number(order.total).toFixed(2)}</p>
                  </div>
                  
                  <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl group/btn">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
