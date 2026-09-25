import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the community at your institution."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="text-ruchi-purple font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
