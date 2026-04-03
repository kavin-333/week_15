import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/20 via-[#0F0F0F] to-[#FF6584]/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#6C63FF]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF6584]/15 rounded-full blur-[150px]" />

      {}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center max-w-3xl mx-auto">
          {}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#6C63FF]" />
            <span className="text-xs font-medium text-[#6C63FF]">
              New Collection 2026
            </span>
          </div>

          {}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Discover{" "}
            <span className="gradient-text">Products</span>
            <br />
            You&apos;ll Love
          </h1>

          {}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Curated collection of the finest products. Shop with confidence,
            enjoy free shipping on orders over $50.
          </p>

          {}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-[#6C63FF]/30 hover:shadow-[#6C63FF]/50 transition-all duration-300"
                id="hero-shop-now"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products?category=electronics">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8 h-12 text-base border-white/10 hover:bg-white/5 transition-smooth"
                id="hero-explore"
              >
                Explore Categories
              </Button>
            </Link>
          </div>

          {}
          <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16">
            {[
              { value: "10K+", label: "Products" },
              { value: "50K+", label: "Customers" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
