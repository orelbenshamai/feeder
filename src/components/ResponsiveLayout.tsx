"use client";

import type { ReactNode } from "react";
import { useIsLgUp } from "@/lib/use-media-query";

type Props = {
  mobile: ReactNode;
  desktop: ReactNode;
};

/** Renders one layout branch for the current viewport — never mounts both. */
export default function ResponsiveLayout({ mobile, desktop }: Props) {
  const isLgUp = useIsLgUp();
  return isLgUp === true ? desktop : mobile;
}
