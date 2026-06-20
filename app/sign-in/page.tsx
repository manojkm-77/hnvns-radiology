import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.04),transparent_40%)]" />
      <SignIn />
    </div>
  );
}
