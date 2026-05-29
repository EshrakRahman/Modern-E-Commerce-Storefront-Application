import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "@/routes/root.tsx";
import NewArrivalsPage from "@/pages/NewArrivals";

export const newArrivalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/new-arrivals",
  validateSearch: z.object({
    cursor: z.any().optional(),
    category: z.any().optional(),
    minPrice: z.any().optional(),
    maxPrice: z.any().optional(),
    size: z.any().optional(),
    page: z.any().optional(),
    brand: z.any().optional(),
  }),
  component: NewArrivalsPage,
});
