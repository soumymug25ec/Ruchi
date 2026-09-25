import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-ruchi-bg-light">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
