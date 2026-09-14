import { Hero } from "@/components/marketing/hero";
import { MarketingNav } from "@/components/marketing/nav";
import {
  BuiltOn,
  FinalCta,
  HowItWorks,
  Limits,
  MarketingFooter,
  ProblemBand,
} from "@/components/marketing/sections";

export default function Home() {
  return (
    <div className="min-h-dvh bg-paper">
      <MarketingNav />
      <main>
        <Hero />
        <ProblemBand />
        <HowItWorks />
        <Limits />
        <BuiltOn />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
