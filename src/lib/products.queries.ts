import { queryOptions } from "@tanstack/react-query";
import { listOwnerProducts, listPublicProducts } from "./products.functions";

export const publicProductsQuery = queryOptions({
  queryKey: ["products", "public"],
  queryFn: () => listPublicProducts(),
});

export const ownerProductsQuery = queryOptions({
  queryKey: ["products", "owner"],
  queryFn: () => listOwnerProducts(),
});
