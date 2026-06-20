import { redirect } from 'next/navigation';

// Sign-up is not used — redirect to home.
export default function SignUpPage() {
  redirect('/');
}
