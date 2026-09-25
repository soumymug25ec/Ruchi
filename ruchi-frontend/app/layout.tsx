import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruchi — Find your people",
  description:
    "Ruchi helps you discover people and communities based on what you love — in your college, school, hostel or locality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-ruchi-navy">
        {children}
      </body>
    </html>
  );
}
