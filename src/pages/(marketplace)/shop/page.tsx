import React from "react";
import { PageTransition } from "@/components/layout";

const ShopPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Shop</h1>
        <p className="text-muted-foreground max-w-md">
          Browse through our curated collection of products in the shop.
        </p>
      </div>
    </PageTransition>
  );
};

export default ShopPage;
