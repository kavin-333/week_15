"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cart.store";
import { createClient } from "@/lib/supabase/client";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { useCartSync } from "@/hooks/useCartSync";
import { useRouter } from "next/navigation";

const categories = ["All", "Electronics", "Fashion", "Home", "Beauty"];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const router = useRouter();
  const supabase = createClient();
  
  useCartSync();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    if (supabase?.auth) {
      supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
        setUser(session?.user || null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        subscription.unsubscribe();
      };
    } else {
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [supabase?.auth]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled
          ? "bg-[#0F0F0F]/80 border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-black bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-transparent bg-clip-text">
              ShopZen
            </span>
          </Link>

          {}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#6C63FF] transition-colors" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 bg-white/5 border-white/10 rounded-full focus:border-[#6C63FF]/50 focus:ring-[#6C63FF]/20 transition-all h-10 w-full"
              />
            </div>
          </form>

          {}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            
            {}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="gap-1 hover:bg-white/5 rounded-full px-4 text-sm font-medium" />}>
                    Categories <ChevronDown className="h-4 w-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/10">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} className="hover:bg-white/5 cursor-pointer">
                      <Link href={`/products?category=${category.toLowerCase()}`}>{category}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/5 rounded-full h-10 w-10 transition-colors"
                id="cart-button"
              >
                <motion.div
                  key={mounted ? cartCount : 0}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="relative flex items-center justify-center h-full w-full"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#FF6584] text-[10px] font-bold border-0 shadow-sm">
                      {cartCount}
                    </Badge>
                  )}
                </motion.div>
              </Button>
            </Link>

            {}
            {mounted ? (
              user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-full h-10 w-10 bg-white/5 border border-white/10 overflow-hidden" id="user-menu-button" />}>
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/10">
                    <DropdownMenuItem className="hover:bg-white/5">
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/5">
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/5 text-red-400 focus:text-red-400" onClick={() => supabase.auth.signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/sign-in" className="hidden sm:block">
                  <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-full px-6 font-medium transition-all shadow-lg shadow-[#6C63FF]/20 h-10">
                    Log In
                  </Button>
                </Link>
              )
            ) : (
              <div className="h-10 w-10 sm:w-24 rounded-full bg-white/5 animate-pulse" />
            )}

            {}
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden hover:bg-white/5 rounded-full h-10 w-10 ml-1" />}>
                  <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0F0F0F] border-l-white/10 w-80 p-0 flex flex-col">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex items-center border-b border-white/10 p-4">
                  <span className="text-xl font-black bg-gradient-to-r from-[#6C63FF] to-[#FF6584] text-transparent bg-clip-text">
                    ShopZen
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                  {}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 rounded-xl w-full focus:border-[#6C63FF]/50"
                      />
                    </div>
                  </form>

                  {}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
                    <div className="flex flex-col gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category}
                          href={`/products?category=${category.toLowerCase()}`}
                          className="text-lg font-medium hover:text-[#6C63FF] transition-colors p-2 rounded-lg hover:bg-white/5"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {}
                <div className="p-4 border-t border-white/10">
                  {!user ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/auth/sign-in" className="w-full">
                        <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5">Log In</Button>
                      </Link>
                      <Link href="/auth/sign-up" className="w-full">
                        <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl shadow-lg shadow-[#6C63FF]/20">Sign Up</Button>
                      </Link>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 text-red-400" onClick={() => supabase.auth.signOut()}>
                      Log Out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
