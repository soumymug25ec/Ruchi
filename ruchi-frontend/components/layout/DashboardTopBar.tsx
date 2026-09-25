import { Search } from "lucide-react";

export function DashboardTopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-black/5 bg-white px-8 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-extrabold text-ruchi-navy">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ruchi-text-secondary">{subtitle}</p>
        )}
      </div>
      <div className="relative hidden sm:block">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ruchi-text-secondary"
        />
        <input
          type="search"
          placeholder="Search people, communities..."
          className="pl-10 pr-4 py-2 w-72 rounded-full bg-ruchi-bg-light text-sm focus:outline-none focus:ring-2 focus:ring-ruchi-purple-light"
        />
      </div>
    </header>
  );
}
