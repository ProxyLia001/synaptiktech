import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];

export type ProductDraft = {
  id: string | null;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  stage: string;
  tags: string[];
  link: string;
  link_label: string;
  disclaimer: string;
  is_published: boolean;
  sort_order: number;
};

// Publishable (browser-safe) defaults so other hosts work without extra setup.
const DEFAULT_URL = "https://iuwmlyfpmauwiokvfapj.supabase.co";
const DEFAULT_KEY = "sb_publishable_ukBxncsqN6S03H_dm7Ubdw_lisiLvCc";

// Public reads use a publishable client: visitors only ever see published rows.
function createPublishableClient() {
  const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"] || DEFAULT_URL;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || DEFAULT_KEY;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        // Opaque sb_ keys are not JWTs: send apikey only, never a bearer copy.
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

async function requireOwner(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.rpc("current_user_is_admin");
  if (error || !data) throw new Error("Only the site owner can manage products.");
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseProductDraft(input: unknown): ProductDraft {
  if (typeof input !== "object" || input === null) throw new Error("Invalid product data.");
  const raw = input as Record<string, unknown>;

  const name = text(raw["name"], 80);
  if (!name) throw new Error("A product needs a name.");

  const seed = (text(raw["slug"], 60) || name).toLowerCase();
  const slug = seed.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";

  const link = text(raw["link"], 500);
  if (link && !/^https?:\/\//i.test(link)) {
    throw new Error("A project link must start with http:// or https://");
  }

  const rawTags = raw["tags"];
  const tags = Array.isArray(rawTags)
    ? rawTags.map(tag => text(tag, 40)).filter(Boolean).slice(0, 6)
    : text(rawTags, 240).split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 6);

  const id = raw["id"];
  const sortOrder = Number(raw["sort_order"]);

  return {
    id: typeof id === "string" && id ? id : null,
    slug,
    name,
    tagline: text(raw["tagline"], 160),
    summary: text(raw["summary"], 2000),
    stage: text(raw["stage"], 60) || "Early-stage project",
    tags,
    link,
    link_label: text(raw["link_label"], 40) || "Open project",
    disclaimer: text(raw["disclaimer"], 600),
    is_published: raw["is_published"] !== false,
    sort_order: Number.isFinite(sortOrder) ? Math.trunc(sortOrder) : 0,
  };
}

export const listPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = createPublishableClient();
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error("Products could not be loaded.");
  return (data ?? []) as Product[];
});

export const listOwnerProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireOwner(context.supabase);
    const { data, error } = await context.supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error("Products could not be loaded.");
    return (data ?? []) as Product[];
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => parseProductDraft(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase);
    const payload = {
      slug: data.slug,
      name: data.name,
      tagline: data.tagline,
      summary: data.summary,
      stage: data.stage,
      tags: data.tags,
      link: data.link || null,
      link_label: data.link_label,
      disclaimer: data.disclaimer,
      is_published: data.is_published,
      sort_order: data.sort_order,
    };

    const query = data.id
      ? context.supabase.from("products").update(payload).eq("id", data.id)
      : context.supabase.from("products").insert(payload);

    const { data: saved, error } = await query.select("*").single();
    if (error) {
      if (error.code === "23505") throw new Error("Another product already uses that web address.");
      throw new Error("The product could not be saved.");
    }
    return saved as Product;
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = (input as Record<string, unknown>)?.["id"];
    if (typeof id !== "string" || !id) throw new Error("Missing product.");
    return id;
  })
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase);
    const { error } = await context.supabase.from("products").delete().eq("id", data);
    if (error) throw new Error("The product could not be removed.");
    return { ok: true };
  });
