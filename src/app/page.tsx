"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ToysPageWrapper from "./ToyPage";

const ToysListPage = dynamic(() => import("./toys/page"), { ssr: false });

export default function Home() {
  return (<Suspense  fallback={<div>Loading...</div>}>
    <ToysPageWrapper />
  </Suspense>);
}
