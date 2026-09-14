import { LibraryView } from "@/components/library/library-view";
import { CLUSTERS, type ClusterId } from "@/lib/data/library";

export const metadata = { title: "Library · Contextualize" };

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ cluster?: string }>;
}) {
  const { cluster } = await searchParams;
  const known = CLUSTERS.some((c) => c.id === cluster) || cluster === "unplaced";
  return <LibraryView initialFilter={known ? (cluster as ClusterId | "unplaced") : undefined} />;
}
