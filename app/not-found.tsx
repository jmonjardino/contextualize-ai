import { ButtonLink } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/workspace/wordmark";

export const metadata = { title: "Not in the library · Contextualize" };

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="flex h-18 items-center px-6 lg:px-14">
        <Wordmark size={20} />
      </header>

      <main className="flex grow items-center px-6 lg:px-14">
        <div className="max-w-[520px]">
          <Label>Error 404</Label>
          <h1 className="mt-4 mb-4 font-display text-[clamp(34px,6vw,52px)] leading-[1.1] tracking-[-0.018em]">
            Nothing is filed under that address.
          </h1>
          <p className="mb-8 text-[15px] leading-[1.62] text-muted text-pretty">
            The page you asked for is not in the catalogue. It may have been removed, or the
            address may have been mistyped — catalogue numbers are easy to transpose.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/library" variant="primary" size="lg">
              Browse the library
            </ButtonLink>
            <ButtonLink href="/ask" size="lg">
              Ask instead
            </ButtonLink>
          </div>
        </div>
      </main>

      <footer className="flex h-16 items-center px-6 lg:px-14">
        <span className="font-mono text-[10.5px] tracking-[0.06em] text-faint uppercase">
          Contextualize.ai
        </span>
      </footer>
    </div>
  );
}
