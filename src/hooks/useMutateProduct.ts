import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useProductStore } from "@/store/products.store";

export function useMutateProduct() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { addProduct, updateProduct, deleteProduct } = useProductStore();

  const createMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase.from("products").insert([productData]).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addProduct(data as any);
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ id, ...updateData }: { id: string } & any) => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateProduct(data as any);
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
