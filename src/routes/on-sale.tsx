import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "@/routes/root.tsx";
import OnSalePage from "@/pages/OnSale";

export const onSaleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/on-sale",
  validateSearch: z.object({
    cursor: z.any().optional(),
    category: z.any().optional(),
    minPrice: z.any().optional(),
    maxPrice: z.any().optional(),
    size: z.any().optional(),
    page: z.any().optional(),
    brand: z.any().optional(),
  }),
  component: OnSalePage,
});
