"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ToysListPage = dynamic(() => import("./toys/page"), { ssr: false });

export default function Home() {
  return (<Suspense  fallback={<div>Loading...</div>}>
    <ToysListPage />
  </Suspense>);
}
