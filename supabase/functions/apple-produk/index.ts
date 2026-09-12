import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const itemGroupId = parts.length > 1
      ? decodeURIComponent(parts[parts.length - 1])
      : null;

    if (req.method === "GET") {
      if (itemGroupId) {
        const { data, error } = await supabase
          .from("apple_produk")
          .select("*")
          .eq("item_group_id", itemGroupId)
          .single();

        if (error) return json({ success: false, error: error.message }, 404);
        return json({ success: true, data });
      }

      const { data, error } = await supabase
        .from("apple_produk")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return json({ success: false, error: error.message }, 400);
      return json({ success: true, count: data?.length ?? 0, data });
    }

    if (req.method === "POST") {
      const body = await req.json();
      if (!body.item_group_id) {
        return json({ success: false, error: "item_group_id is required" }, 400);
      }

      const { data, error } = await supabase
        .from("apple_produk")
        .insert(body)
        .select("*")
        .single();

      if (error) return json({ success: false, error: error.message }, 400);
      return json({ success: true, message: "Product created successfully", data }, 201);
    }

    if (req.method === "PUT") {
      if (!itemGroupId) {
        return json({ success: false, error: "item_group_id is required" }, 400);
      }

      const body = await req.json();
      delete body.item_group_id;
      delete body.id;
      body.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("apple_produk")
        .update(body)
        .eq("item_group_id", itemGroupId)
        .select("*")
        .single();

      if (error) return json({ success: false, error: error.message }, 400);
      return json({ success: true, message: "Product updated successfully", data });
    }

    if (req.method === "DELETE") {
      if (!itemGroupId) {
        return json({ success: false, error: "item_group_id is required" }, 400);
      }

      const { data, error } = await supabase
        .from("apple_produk")
        .delete()
        .eq("item_group_id", itemGroupId)
        .select("*")
        .single();

      if (error) return json({ success: false, error: error.message }, 400);
      return json({ success: true, message: "Product deleted successfully", data });
    }

    return json({ success: false, error: "Method not allowed" }, 405);
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, 500);
  }
});
