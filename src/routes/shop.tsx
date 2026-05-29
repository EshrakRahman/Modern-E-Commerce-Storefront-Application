import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "@/routes/root.tsx";
import ShopPage from "@/pages/Shop";

export const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  validateSearch: z.object({
    cursor: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    size: z.string().optional(),
    page: z.coerce.number().optional(),
    brand: z.string().optional(),
  }),
  component: ShopPage,
});
