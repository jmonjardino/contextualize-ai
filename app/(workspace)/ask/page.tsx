import { AskView } from "@/components/ask/ask-view";
import { docById } from "@/lib/data/library";

export const metadata = { title: "Ask · Contextualize" };

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const { doc } = await searchParams;
  const scoped = doc ? docById(doc) : undefined;
  return <AskView scopeDoc={scoped ? { id: scoped.id, title: scoped.title } : undefined} />;
}
