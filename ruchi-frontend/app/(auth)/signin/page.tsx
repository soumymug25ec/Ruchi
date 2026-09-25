import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to your community."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-ruchi-purple font-semibold">
            Sign up
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
