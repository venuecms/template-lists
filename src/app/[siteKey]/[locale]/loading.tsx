import {
  FeaturedEventsSkeleton,
  FeaturedProfilesSkeleton,
  ProductsSkeleton,
} from "@/components/HomePage/LoadingSkeletons";

export default function Loading() {
  return (
    <>
      <FeaturedEventsSkeleton />
      <FeaturedProfilesSkeleton />
      <ProductsSkeleton />
    </>
  );
}
