import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/database";
import { useProductStore } from "@/store/products.store";

interface ProductsParams {
  category?: string;
  sort?: string;
  page?: number;
  search?: string;
}

export function useProducts(params?: ProductsParams) {
  const storeProducts = useProductStore((s) => s.products);

  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      return storeProducts as Product[];
    },
  });
}

export function useProduct(id: string) {
  const products = useProductStore((s) => s.products);

  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const product = products.find(p => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  const storeCategories = useProductStore((s) => s.categories);

  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return storeCategories;
    },
  });
}
