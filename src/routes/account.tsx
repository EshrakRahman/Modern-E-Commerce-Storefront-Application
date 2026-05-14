import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/root.tsx";
import AccountPage from "@/pages/Account";

export const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});
