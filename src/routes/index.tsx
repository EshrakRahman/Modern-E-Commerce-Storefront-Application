import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "@/routes/root.tsx";
import { homeRoute } from "@/routes/home.tsx";
import { productRoute } from "@/routes/product.tsx";
import { categoryRoute } from "@/routes/category.tsx";
import { cartRoute } from "@/routes/cart.tsx";
import { checkoutRoute } from "@/routes/checkout.tsx";
import { wishlistRoute } from "@/routes/wishlist.tsx";
import { orderSuccessRoute } from "@/routes/order-success.tsx";
import { loginRoute } from "@/routes/login.tsx";
import { ordersRoute } from "@/routes/orders.tsx";
import { newArrivalsRoute } from "@/routes/new-arrivals.tsx";
import { shopRoute } from "@/routes/shop.tsx";
import { onSaleRoute } from "@/routes/on-sale.tsx";
import { brandsRoute } from "@/routes/brands.tsx";
import { accountRoute } from "@/routes/account.tsx";

const routeTree = rootRoute.addChildren([
  homeRoute,
  productRoute,
  categoryRoute,
  cartRoute,
  checkoutRoute,
  wishlistRoute,
  orderSuccessRoute,
  loginRoute,
  ordersRoute,
  newArrivalsRoute,
  shopRoute,
  onSaleRoute,
  brandsRoute,
  accountRoute,
]);

export const router = createRouter({ routeTree });
