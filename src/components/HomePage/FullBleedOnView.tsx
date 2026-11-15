"use client";

import {
  type CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

/** Share of the content that must be on screen before it expands. */
const ENTER_RATIO = 0.25;

/** Share of the video that must be on screen for it to be scrolled into line. */
const ALIGN_RATIO = 0.6;

/** Length of the expansion; matches the `duration-1000` classes below. */
const EXPAND_MS = 1000;

/** Media height as a share of width while in the column (16:9). */
const COLUMN_ASPECT = 9 / 16;

// All under motion-safe: transition-[...] sets its own 150ms duration inside
// that media query, which would beat an unprefixed one.
const TRANSITION = "motion-safe:duration-1000 motion-safe:ease-in-out";

/**
 * Embedded media fills the box this component sizes. `!` because the SDK's
 * renderer puts inline width, max-width and aspect-ratio on embed iframes
 * (4:3 for YouTube/Vimeo), which would otherwise win.
 */
const MEDIA = [
  "[&_iframe]:block [&_iframe]:!w-full [&_iframe]:!max-w-none [&_iframe]:!aspect-auto [&_iframe]:!h-[var(--media-height)]",
  "[&_video]:block [&_video]:!w-full [&_video]:!max-w-none [&_video]:!h-[var(--media-height)] [&_video]:object-contain [&_video]:bg-black",
  "[&_iframe]:motion-safe:transition-[height] [&_video]:motion-safe:transition-[height]",
  "[&_iframe]:motion-safe:duration-1000 [&_video]:motion-safe:duration-1000",
  "[&_iframe]:motion-safe:ease-in-out [&_video]:motion-safe:ease-in-out",
].join(" ");

/**
 * Expands its content from the column to the full screen once it scrolls into
 * view: the box widens to the viewport width, and any embedded video (iframe
 * or <video>) grows to the viewport height. It shrinks back after leaving the
 * screen, so the effect replays.
 *
 * Animates real size rather than a scale transform, so the player stays sharp
 * and growing pushes the content below down instead of drawing over it.
 * Heights are set in px on both ends (16:9 of the column, then the viewport
 * height) because `height` can't transition from an aspect-ratio-derived
 * `auto`.
 *
 * Widths are measured from the column's own position rather than with 100vw,
 * which includes the scrollbar and would make the page scroll sideways.
 */
export const FullBleedOnView = ({ children }: { children: ReactNode }) => {
  const outer = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [size, setSize] = useState({
    viewportWidth: 0,
    viewportHeight: 0,
    columnWidth: 0,
    left: 0,
  });

  useEffect(() => {
    const element = outer.current;
    if (!element) return;

    const measure = () =>
      setSize({
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: window.innerHeight,
        columnWidth: element.clientWidth,
        left: element.getBoundingClientRect().left + window.scrollX,
      });
    measure();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= ENTER_RATIO) {
          measure();
          setActive(true);
        } else if (!entry.isIntersecting) {
          setActive(false);
        }
      },
      { threshold: [0, ENTER_RATIO] },
    );

    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const measured = size.viewportWidth > 0;
  const expanded = active && measured;

  // Once expanded, scroll the video (or the box, if it holds none) to the top
  // of the screen so it actually fills it. Waits for the expansion to finish:
  // the box widening reflows any text above the video, so its final position
  // isn't known until then. Cancelled if it leaves the screen first.
  useEffect(() => {
    if (!expanded) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timer = window.setTimeout(
      () => {
        const element = outer.current;
        const target =
          element?.querySelector("iframe, video") ?? element ?? null;
        if (!target) return;

        // Only nudge it when it's mostly on screen already, so this doesn't
        // drag the page back from someone scrolling past.
        const rect = target.getBoundingClientRect();
        const visible =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibleShare =
          visible / Math.min(rect.height, window.innerHeight);
        if (!(visibleShare >= ALIGN_RATIO)) return;

        window.scrollTo({
          top: rect.top + window.scrollY,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      },
      reduceMotion ? 0 : EXPAND_MS,
    );
    return () => window.clearTimeout(timer);
  }, [expanded]);

  const style = {
    width: expanded ? size.viewportWidth : "100%",
    marginLeft: expanded ? -size.left : 0,
    // Unset until measured, so server render and first paint keep the SDK's
    // own embed sizing instead of collapsing to zero height.
    ...(measured && {
      "--media-height": `${Math.round(
        expanded ? size.viewportHeight : size.columnWidth * COLUMN_ASPECT,
      )}px`,
    }),
  } as CSSProperties;

  return (
    <div ref={outer}>
      <div
        className={`motion-safe:transition-[width,margin] ${TRANSITION} ${
          measured ? MEDIA : ""
        }`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
};
