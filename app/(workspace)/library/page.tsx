import { LibraryView } from "@/components/library/library-view";
import { CLUSTERS, type ClusterId } from "@/lib/data/library";

export const metadata = { title: "Library · Contextualize" };

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ cluster?: string }>;
}) {
  const { cluster } = await searchParams;
  const valid = CLUSTERS.some((c) => c.id === cluster);
  return <LibraryView initialCluster={valid ? (cluster as ClusterId) : undefined} />;
}
