"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const SidebarContent = ({ pathname }: { pathname: string }) => (
  <div className="flex flex-col h-full bg-[#111122] border-r border-white/10 w-64 shrink-0 px-4 py-8">
    {/* Logo */}
    <div className="flex items-center gap-2 px-2 mb-10">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6C63FF]/30">
        S
      </div>
      <span className="text-xl font-bold tracking-tight">ShopZen Admin</span>
    </div>

    {/* Nav Links */}
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-[#6C63FF]/10 text-[#6C63FF] font-semibold"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>

    {/* Actions */}
    <div className="mt-auto">
      <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl px-3 py-6 font-medium">
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </div>
  </div>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Topbar & Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-[#111122]/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6C63FF]/30">
              S
            </div>
          </div>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-full" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-white/10 w-64 bg-[#111122]">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SidebarContent pathname={pathname} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
