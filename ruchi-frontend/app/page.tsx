import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { ClosingCta } from "@/components/marketing/ClosingCta";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="bg-gradient-to-b from-ruchi-bg-light to-white">
        <MarketingNav />
        <Hero />
      </div>
      <Features />
      <ClosingCta />
    </main>
  );
}
