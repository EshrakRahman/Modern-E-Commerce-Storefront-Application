import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/root.tsx";
import BrandsPage from "@/pages/Brands";

export const brandsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/brands",
  component: BrandsPage,
});
