import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ruchi-bg-light to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <Logo size="lg" showWordmark={false} />
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_24px_rgba(26,31,58,0.08)] border border-black/5">
          <h1 className="text-2xl font-extrabold text-ruchi-navy mb-1.5">
            {title}
          </h1>
          <p className="text-ruchi-text-secondary mb-7">{subtitle}</p>
          {children}
        </div>

        <div className="mt-6 text-center text-sm text-ruchi-text-secondary">
          {footer}
        </div>
      </div>
    </div>
  );
}
