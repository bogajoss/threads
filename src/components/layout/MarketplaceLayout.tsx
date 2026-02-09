import React, { Suspense } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import PageTransition from "./PageTransition";
import { ArrowLeft, ShoppingBag, Crown } from "lucide-react";
import { SkeletonPost } from "@/components/ui";

const MarketplaceLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              to="/feed"
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline text-sm font-medium">
                Back to Feed
              </span>
            </Link>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <span className="text-lg font-bold tracking-tight">
              Marketplace
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/pro"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === "/pro"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
            >
              <Crown size={18} />
              <span className="hidden xs:inline">Pro</span>
            </Link>
            <Link
              to="/shop"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === "/shop"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
            >
              <ShoppingBag size={18} />
              <span className="hidden xs:inline">Shop</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="w-full">

        <Suspense fallback={
          <div className="container mx-auto py-8 px-4 flex flex-col">
            <SkeletonPost />
          </div>
        }>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>
    </div>
  );
};

export default MarketplaceLayout;