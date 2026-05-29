import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "@/routes/root.tsx";
import NewArrivalsPage from "@/pages/NewArrivals";

export const newArrivalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/new-arrivals",
  validateSearch: z.object({
    cursor: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    size: z.string().optional(),
    page: z.coerce.number().optional(),
    brand: z.string().optional(),
  }),
  component: NewArrivalsPage,
});
