import { redirect } from 'next/navigation';

// Sign-in is not used — redirect to home.
export default function SignInPage() {
  redirect('/');
}
