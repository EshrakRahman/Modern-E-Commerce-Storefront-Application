import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "@/routes/root.tsx";
import CategoryProducts from "@/pages/CategoryProducts";

export const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories/$slug",
  validateSearch: z.object({
    cursor: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    size: z.string().optional(),
    q: z.string().optional(),
    page: z.coerce.number().optional(),
    brand: z.string().optional(),
  }),
  component: CategoryProducts,
});
