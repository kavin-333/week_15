import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useCartStore, CartItem } from "@/store/cart.store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbRecord = Record<string, any>;

export function useCartSync() {
  const { items, setItems } = useCartStore();
  const supabase = createClient();

  useEffect(() => {
    const syncCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) return;

      // 1. Fetch items from DB
      const { data: dbItems, error: fetchError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);

      if (fetchError) {
        console.error("Error fetching cart from DB:", fetchError);
        return;
      }

      // map DB items format to CartItem store format
      const formattedDbItems: CartItem[] = (dbItems || []).map((item: DbRecord) => ({
        productId: item.product_id,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        quantity: item.quantity,
      }));

      // 2. Merge local items into DB if local exists
      if (items.length > 0) {
        let hasMerged = false;
        for (const localItem of items) {
          const existsInDb = formattedDbItems.find(dbItem => dbItem.productId === localItem.productId);
          
          if (existsInDb) {
            // Update quantity if local is different
            if (localItem.quantity > existsInDb.quantity) {
              await supabase
                .from("cart_items")
                .update({ quantity: localItem.quantity })
                .eq("user_id", user.id)
                .eq("product_id", localItem.productId);
              hasMerged = true;
            }
          } else {
            // Insert local item to DB
            await supabase
              .from("cart_items")
              .insert({
                user_id: user.id,
                product_id: localItem.productId,
                name: localItem.name,
                price: localItem.price,
                image: localItem.image,
                quantity: localItem.quantity,
              });
            hasMerged = true;
          }
        }

        if (hasMerged) {
          // Re-fetch final merged state
          const { data: finalDbItems } = await supabase
            .from("cart_items")
            .select("*")
            .eq("user_id", user.id);
          
          setItems((finalDbItems || []).map((item: DbRecord) => ({
            productId: item.product_id,
            name: item.name,
            price: Number(item.price),
            image: item.image,
            quantity: item.quantity,
          })));
        } else {
          setItems(formattedDbItems);
        }
      } else {
        // Just load DB items into store
        setItems(formattedDbItems);
      }
    };

    syncCart();
    
    // Set up auth listener to re-sync on login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, _session: Session | null) => {
      if (_event === "SIGNED_IN") {
        syncCart();
      } else if (_event === "SIGNED_OUT") {
        setItems([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setItems]); // Only sync once on mount or when supabase instance/setItems changes

  // Note: To avoid infinite loops, we don't automatically sync setItems in a circle.
  // The current approach is: Sync on Load/Login.
  // Future: Wrap store actions to call DB directly.
}
