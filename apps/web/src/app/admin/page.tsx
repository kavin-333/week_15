"use client";

import { useProducts } from "@/hooks/useProducts";
import { Package, ShoppingCart, DollarSign, Users, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

// Extended mock user count and mock revenue, usually fetched from API
const mockStats = {
  revenue: 15430.50,
  customers: 423,
  orders: 142
};

// Mock recent orders for overview
const recentOrders = [
  { id: "ORD-1A8B2C", customer: "Sarah Johnson", total: 129.99, status: "pending", date: "2024-03-10" },
  { id: "ORD-3F9E4D", customer: "Michael Chen", total: 84.50, status: "processing", date: "2024-03-09" },
  { id: "ORD-7K2L5M", customer: "Emma Wilson", total: 249.00, status: "shipped", date: "2024-03-09" },
  { id: "ORD-9N4P6Q", customer: "James Brown", total: 45.99, status: "delivered", date: "2024-03-08" },
];

export default function AdminOverviewPage() {
  const { data: products } = useProducts();

  const totalProducts = products?.length || 0;

  const statCards = [
    { label: "Total Revenue", value: `$${mockStats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, change: "+14.5%" },
    { label: "Total Orders", value: mockStats.orders, icon: ShoppingCart, change: "+5.2%" },
    { label: "Total Products", value: totalProducts, icon: Package, change: "+12 new" },
    { label: "Total Customers", value: mockStats.customers, icon: Users, change: "+2.1%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Overview</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl shadow-lg shadow-[#6C63FF]/30 h-11 px-6 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="glass rounded-3xl p-6 border-white/5 relative overflow-hidden group hover:bg-white/[0.03] transition-colors">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-[#6C63FF]/20 to-[#FF6584]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="p-2 bg-white/5 rounded-xl border border-white/5 text-[#6C63FF]">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-emerald-400 flex items-center font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.change} <span className="text-muted-foreground ml-1">from last month</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="outline" className="text-sm border-white/10 hover:bg-white/5 h-9 rounded-lg px-4">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[500px] text-sm text-left">
              <thead className="text-muted-foreground bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium text-center rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 font-mono text-[#6C63FF]">{order.id}</td>
                    <td className="px-4 py-4 font-medium">{order.customer}</td>
                    <td className="px-4 py-4 text-muted-foreground">{order.date}</td>
                    <td className="px-4 py-4 font-semibold">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant="outline" className={`border-0 rounded-md font-semibold px-2.5 py-1 uppercase tracking-wider text-[10px] ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                        order.status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
                        order.status === 'shipped' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products / Low Stock alert */}
        <div className="lg:col-span-1 glass rounded-3xl p-6 sm:p-8 border-white/5 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Low Stock Items</h2>
          
          <div className="space-y-4 flex-1">
            {products?.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4 group">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden glass shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate group-hover:text-[#6C63FF] transition-colors">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block bg-red-500/10 text-red-500 font-bold text-xs px-2 py-1 rounded-md mb-1">
                    2 left
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Link href="/admin/products" className="mt-6 block w-full">
            <Button variant="ghost" className="w-full text-sm text-[#6C63FF] hover:text-[#5A52E0] hover:bg-[#6C63FF]/10 font-medium">
              Manage Inventory
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
