import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";

export function MarketingNav() {
  return (
    <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      <Logo />
      <div className="hidden md:flex items-center gap-8 text-ruchi-navy font-medium">
        <a href="#about" className="hover:text-ruchi-purple transition-colors">
          About
        </a>
        <a href="#features" className="hover:text-ruchi-purple transition-colors">
          Features
        </a>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/signin">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    </nav>
  );
}
