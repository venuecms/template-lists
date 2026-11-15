import { cn } from "@/lib/utils";

export const ColumnLeft = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("flex flex-col", className)} {...props} />;
};

/**
 * For a title placed directly in a ColumnLeft: on desktop it stays under the
 * sticky site header while its section scrolls, and the next section's title
 * takes over. The column spans its row there, which is what bounds it.
 *
 * Pins at --sticky-title-top (globals.css), where `fadePastTitle` text in the
 * column beside it fades out.
 *
 * Backed by the page color so what scrolls up beneath it (an image, the page
 * tree) passes under rather than through it. Phones stack the columns, so it
 * would have nothing to stick across there.
 */
export const stickyColumnTitle =
  "lg:sticky lg:top-[var(--sticky-title-top)] lg:z-10 lg:bg-background";

/**
 * For the column beside a sticky title: its text lines fade out as they
 * scroll up past the title (see .fade-past-title in globals.css).
 */
export const fadePastTitle = "fade-past-title";
