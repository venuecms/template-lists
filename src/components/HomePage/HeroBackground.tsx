"use client";

import { ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { HERO_FADE_TRIGGER } from "./heroFade";

/** How far ahead of the row's bottom the fade starts, as a share of the viewport height. */
const FADE_LEAD = 0.2;

/**
 * The viewport y of the bottom of a grid's first row: the lowest bottom edge
 * among the children that start on the same line as the first one. Measured
 * from the items rather than the grid, which spans every row (two on mobile)
 * plus its bottom padding.
 */
const firstRowBottom = (grid: Element) => {
  const items = Array.from(grid.children).map((child) =>
    child.getBoundingClientRect(),
  );
  if (!items.length) return grid.getBoundingClientRect().bottom;

  const rowTop = items[0].top;
  return Math.max(
    ...items
      .filter((item) => Math.abs(item.top - rowTop) < 1)
      .map((item) => item.bottom),
  );
};

/**
 * The fixed hero image behind the home page. Fades to 0% opacity once the
 * bottom of the first row of the grid marked with HERO_FADE_TRIGGER (the
 * product grid) scrolls into view, and back in when it scrolls out below.
 *
 * Checked on scroll rather than with an IntersectionObserver set up on mount:
 * the products stream in through their own Suspense boundary, so the trigger
 * often doesn't exist yet when this mounts.
 */
export const HeroBackground = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const trigger = document.querySelector(`[${HERO_FADE_TRIGGER}]`);
      const bottom = trigger ? firstRowBottom(trigger) : undefined;
      // Starts the fade a fifth of a screen before the row's bottom arrives.
      setHidden(
        bottom !== undefined && bottom <= window.innerHeight * (1 + FADE_LEAD),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={cn(
        // All under motion-safe: transition-opacity sets its own 150ms
        // duration inside that media query, which would beat an unprefixed one.
        "motion-safe:transition-opacity motion-safe:duration-[2000ms] motion-safe:ease-out",
        hidden && "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
};
