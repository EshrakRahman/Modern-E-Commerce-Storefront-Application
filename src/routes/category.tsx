import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "@/routes/root.tsx";
import CategoryProducts from "@/pages/CategoryProducts";

export const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories/$slug",
  validateSearch: z.object({
    cursor: z.any().optional(),
    minPrice: z.any().optional(),
    maxPrice: z.any().optional(),
    size: z.any().optional(),
    q: z.any().optional(),
    page: z.any().optional(),
  }),
  component: CategoryProducts,
});
