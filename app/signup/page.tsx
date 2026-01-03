// src/app/(routes)/signup/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import SignupForm from '../components/auth/SignupForm/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <SignupForm onSuccess={handleSuccess} />
    </div>
  );
}