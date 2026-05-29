import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "@/routes/root.tsx";
import OnSalePage from "@/pages/OnSale";

export const onSaleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/on-sale",
  validateSearch: z.object({
    cursor: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    size: z.string().optional(),
    page: z.coerce.number().optional(),
    brand: z.string().optional(),
  }),
  component: OnSalePage,
});
