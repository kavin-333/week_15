import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/database";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] glass transition-all duration-300 hover:shadow-lg hover:shadow-[#6C63FF]/10 hover:border-[#6C63FF]/20">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-white/70">
            {category.productCount} products
          </p>
        </div>
      </div>
    </Link>
  );
}
