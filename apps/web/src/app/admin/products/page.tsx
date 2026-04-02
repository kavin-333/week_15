"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Products Management</h1>
          <p className="text-muted-foreground">Manage your store&apos;s product inventory and details.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl shadow-lg shadow-[#6C63FF]/30 h-11 px-6 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8 border-white/5">
        {/* Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm border border-white/10 rounded-xl bg-white/5 focus-within:border-[#6C63FF]/50 transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
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
                <th className="px-5 py-4 font-medium rounded-tl-xl w-16">Image</th>
                <th className="px-5 py-4 font-medium">Product Name</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Price</th>
                <th className="px-5 py-4 font-medium">Stock</th>
                <th className="px-5 py-4 font-medium text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 animate-pulse">
                    <td className="px-5 py-4"><div className="w-12 h-12 bg-white/5 rounded-lg" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-32 bg-white/5 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-20 bg-white/5 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-16 bg-white/5 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-6 w-16 bg-white/5 rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-8 w-8 bg-white/5 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    No products found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden glass">
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">{product.name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-5 py-4 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      {product.inStock ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-0 rounded-md font-semibold px-2.5 py-1">In Stock</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-0 rounded-md font-semibold px-2.5 py-1">Out of Stock</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1A1A2E] border-white/10 rounded-xl w-40">
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 rounded-lg">
                            <Link href={`/admin/products/${product.id}/edit`} className="flex items-center w-full">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:text-red-300 focus:bg-red-500/10 rounded-lg">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
          <p className="text-muted-foreground">Showing {filteredProducts.length} entries</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled className="border-white/10 rounded-lg h-9 bg-transparent hover:bg-white/5">Previous</Button>
            <Button variant="outline" disabled className="border-white/10 rounded-lg h-9 bg-transparent hover:bg-white/5">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
