"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Eye, Truck, CheckCircle, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Extended mock orders for the Orders Management table
const mockOrders = [
  { id: "ORD-1A8B2C", customer: "Sarah Johnson", email: "sarah@example.com", total: 129.99, status: "pending", date: "2024-03-10", items: 3 },
  { id: "ORD-3F9E4D", customer: "Michael Chen", email: "michael@example.com", total: 84.50, status: "processing", date: "2024-03-09", items: 1 },
  { id: "ORD-7K2L5M", customer: "Emma Wilson", email: "emma@example.com", total: 249.00, status: "shipped", date: "2024-03-09", items: 4 },
  { id: "ORD-9N4P6Q", customer: "James Brown", email: "james@example.com", total: 45.99, status: "delivered", date: "2024-03-08", items: 2 },
  { id: "ORD-5X1Y8Z", customer: "Olivia Davis", email: "olivia@example.com", total: 310.25, status: "shipped", date: "2024-03-07", items: 5 },
  { id: "ORD-2W7R9T", customer: "David Miller", email: "david@example.com", total: 65.00, status: "delivered", date: "2024-03-06", items: 1 },
];

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState(mockOrders);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} status updated to ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-0 rounded-md font-semibold px-2.5 py-1 uppercase tracking-wider text-[10px]">Delivered</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-0 rounded-md font-semibold px-2.5 py-1 uppercase tracking-wider text-[10px]">Processing</Badge>;
      case 'shipped': return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-0 rounded-md font-semibold px-2.5 py-1 uppercase tracking-wider text-[10px]">Shipped</Badge>;
      default: return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-0 rounded-md font-semibold px-2.5 py-1 uppercase tracking-wider text-[10px]">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Orders Management</h1>
          <p className="text-muted-foreground">View order details and update fulfillment status.</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8 border-white/5">
        {/* Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-md border border-white/10 rounded-xl bg-white/5 focus-within:border-[#6C63FF]/50 transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID, Customer Name, or Email..."
              className="pl-10 border-0 bg-transparent h-11 focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-5 py-4 font-medium rounded-tl-xl">Order ID</th>
                <th className="px-5 py-4 font-medium">Customer Details</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Items</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No orders found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-5 font-mono text-[#6C63FF] font-semibold">{order.id}</td>
                    <td className="px-5 py-5">
                      <p className="font-medium text-white">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </td>
                    <td className="px-5 py-5 text-muted-foreground">{order.date}</td>
                    <td className="px-5 py-5 text-muted-foreground">{order.items}</td>
                    <td className="px-5 py-5 font-semibold text-white">${order.total.toFixed(2)}</td>
                    <td className="px-5 py-5">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-5 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}>
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1A1A2E] border-white/10 rounded-xl w-48 p-2">
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/5 rounded-lg mb-1">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuLabel className="text-xs text-muted-foreground px-2 pt-2">Update Status</DropdownMenuLabel>
                          
                          <DropdownMenuItem onClick={() => updateStatus(order.id, 'processing')} className="cursor-pointer hover:bg-white/5 rounded-lg">
                            <Package className="mr-2 h-4 w-4 text-blue-400" /> Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(order.id, 'shipped')} className="cursor-pointer hover:bg-white/5 rounded-lg">
                            <Truck className="mr-2 h-4 w-4 text-orange-400" /> Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(order.id, 'delivered')} className="cursor-pointer hover:bg-white/5 rounded-lg">
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" /> Delivered
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5 text-sm">
          <p className="text-muted-foreground">Showing {filteredOrders.length} entries</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled className="border-white/10 rounded-lg h-9 bg-transparent hover:bg-white/5">Previous</Button>
            <Button variant="outline" disabled className="border-white/10 rounded-lg h-9 bg-transparent hover:bg-white/5">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
