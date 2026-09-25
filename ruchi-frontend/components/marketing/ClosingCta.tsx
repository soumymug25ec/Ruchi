import Link from "next/link";
import { Button } from "@/components/common/Button";

export function ClosingCta() {
  return (
    <section className="relative bg-ruchi-navy text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 75% 30%, rgba(107,95,255,0.35), transparent 55%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 max-w-xl">
          Same interests.
          <br />
          Different stories.
          <br />
          One <span className="text-ruchi-purple">Ruchi</span>.
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-md">
          Find your people. Build your community.
        </p>
        <Link href="/signup">
          <Button size="lg">Sign Up</Button>
        </Link>
      </div>
    </section>
  );
}
