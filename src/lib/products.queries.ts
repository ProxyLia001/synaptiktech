import { queryOptions } from "@tanstack/react-query";
import { listOwnerProducts, listPublicProducts } from "./products.functions";

// Both fetchers fall back to an empty list so a missing response can never
// reach the pages as undefined.
export const publicProductsQuery = queryOptions({
  queryKey: ["products", "public"],
  queryFn: async () => (await listPublicProducts()) ?? [],
});

export const ownerProductsQuery = queryOptions({
  queryKey: ["products", "owner"],
  queryFn: async () => (await listOwnerProducts()) ?? [],
});
