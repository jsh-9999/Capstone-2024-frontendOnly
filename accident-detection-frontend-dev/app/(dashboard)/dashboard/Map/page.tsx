import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("./Home"), { ssr: false });

export default function MapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
