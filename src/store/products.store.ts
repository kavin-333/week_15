import { create } from "zustand";
import { Product, Category } from "@/types/database";
import { products as mockProducts, categories as mockCategories } from "@/lib/mock-data";

interface ProductStore {
  products: Product[];
  categories: Category[];
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  categories: mockCategories,

  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
