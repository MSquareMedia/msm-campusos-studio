"use client";

import dynamic from "next/dynamic";

const SmoothScroll = dynamic(
  () => import("@/components/motion/SmoothScroll").then((m) => m.SmoothScroll),
  { ssr: false }
);

const OSiQChat = dynamic(
  () => import("@/components/osiq/OSiQChat").then((m) => m.OSiQChat),
  { ssr: false }
);

/**
 * Client-only interactive widgets (smooth scrolling and AI assistant chat).
 * Loaded dynamically on the client to keep initial page HTML/JS lean and fast.
 */
export function ClientWidgets() {
  return (
    <>
      <SmoothScroll />
      <OSiQChat />
    </>
  );
}
