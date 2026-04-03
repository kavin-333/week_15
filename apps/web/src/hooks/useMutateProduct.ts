import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useProductStore } from "@/store/products.store";
import type { Product } from "@/types/database";

export function useMutateProduct() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { addProduct, updateProduct, deleteProduct } = useProductStore();

  const createMutation = useMutation({
    mutationFn: async (productData: Record<string, unknown>) => {
      const { data, error } = await supabase.from("products").insert([productData]).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addProduct(data as Product);
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
      updateProduct(data as Product);
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      deleteProduct(id);
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  return {
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
