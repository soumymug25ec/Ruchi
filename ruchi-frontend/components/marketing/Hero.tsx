import Link from "next/link";
import { Button } from "@/components/common/Button";

const FLOATING_TAGS = [
  { emoji: "🎌", label: "Anime & Manga", pos: "top-2 left-4 md:left-0" },
  { emoji: "🎮", label: "Gaming", pos: "top-16 right-0" },
  { emoji: "🎵", label: "Music", pos: "top-44 left-0" },
  { emoji: "📚", label: "Books", pos: "top-40 right-6" },
  { emoji: "✈️", label: "Travel", pos: "bottom-16 left-10" },
  { emoji: "💪", label: "Fitness", pos: "bottom-4 right-2" },
];

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h1 className="text-5xl md:text-[3.4rem] leading-[1.08] font-extrabold text-ruchi-navy mb-6 text-balance">
          Find people with{" "}
          <span className="text-ruchi-purple">shared interests</span> in your
          institution.
        </h1>
        <p className="text-lg text-ruchi-text-secondary mb-9 leading-relaxed max-w-md">
          Ruchi helps you discover people and communities based on what you
          love — in your college, school, hostel or locality.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/signup">
            <Button size="lg">Sign Up</Button>
          </Link>
          <Link href="/signin">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative h-[420px] hidden md:block">
        {FLOATING_TAGS.map((tag) => (
          <div
            key={tag.label}
            className={`absolute ${tag.pos} bg-ruchi-purple-light rounded-full px-4 py-2.5 flex items-center gap-2 shadow-sm`}
          >
            <span className="text-xl leading-none">{tag.emoji}</span>
            <span className="font-semibold text-sm text-ruchi-navy whitespace-nowrap">
              {tag.label}
            </span>
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border-[3px] border-ruchi-navy flex items-center justify-center bg-white shadow-sm">
            <span className="text-4xl font-extrabold text-ruchi-navy">R</span>
          </div>
        </div>
      </div>
    </section>
  );
}
