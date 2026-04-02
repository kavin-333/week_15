import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useOrders() {
  return useQuery({
    queryKey: ["orders", "me"],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
}
