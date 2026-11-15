import { cn } from "@/lib/utils";

export const ListSkeleton = ({
  numElements = 2,
  className,
}: {
  numElements?: number;
  className?: string;
}) => {
  return Array.from({ length: numElements }).map((_, index) => (
    <Skeleton key={index} className={cn("h-16", className)} />
  ));
};

/**
 * A placeholder bar, one line of text tall by default. Given an `aspect-*`
 * class it drops that default height and sizes from its width instead: with
 * both a width and a height set, the browser ignores aspect-ratio, so an
 * "aspect-square" box would otherwise render as a 16px bar.
 */
export const Skeleton = ({ className }: { className?: string }) => {
  const hasAspect = /(^|\s|:)aspect-/.test(className ?? "");

  return (
    <div
      className={cn(
        "w-full bg-primary opacity-[3%]",
        !hasAspect && "h-4",
        className,
      )}
    />
  );
};
