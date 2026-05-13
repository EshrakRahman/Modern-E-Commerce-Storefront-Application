import {createRootRoute, Outlet} from "@tanstack/react-router";
import Navbar from "@/components/navbar/Navbar";
import DesktopNav from "@/components/navbar/DesktopNav";
import CTA from "@/components/cta/CTA.tsx";
import Footer from "@/components/footer/Footer.tsx";
import {Toaster} from "sonner";

export const rootRoute = createRootRoute({
    component: () => (
        <>
                <Toaster position="top-right" richColors/>
            <Navbar/>
            <DesktopNav/>
            <Outlet/>
            <CTA/>
            <Footer/>
    </>
    ),
    errorComponent: ({error}) => (
        <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-black/60">{(error as Error)?.message || "An unexpected error occurred"}</p>
      </div>
    </div>
    ),
    notFoundComponent: () => (
        <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-black/60">Page not found</p>
      </div>
    </div>
    ),
});
