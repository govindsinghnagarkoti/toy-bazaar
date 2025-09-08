"use client";

import { Suspense } from "react";
import ToysPage from "./toys/page";
import ToysListPage from "./toys/page";
export const dynamic = "force-dynamic";

export default function ToysPageWrapper() {
  
  return (
    <Suspense fallback={<div>Loading toys...</div>}>
      <ToysListPage />
    </Suspense>
  );
}
