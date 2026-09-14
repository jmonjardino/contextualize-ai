import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/workspace/wordmark";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#limits", label: "What it will not do" },
  { href: "#pricing", label: "Pricing" },
];

export function MarketingNav() {
  return (
    <header className="flex h-18 items-center justify-between gap-6 border-b border-rule px-6 lg:px-14">
      <Wordmark size={20} />
      <nav className="flex items-center gap-7 max-lg:hidden">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[13.5px] text-ink/80 transition-colors hover:text-ember"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <ButtonLink href="/signin" variant="quiet" className="text-ink max-sm:hidden">
          Sign in
        </ButtonLink>
        <ButtonLink href="/ask" variant="primary" size="lg">
          Add to Chrome
        </ButtonLink>
      </div>
    </header>
  );
}
