//app/(routes)/login/page.tsx

// 'use client';

import { LoginForm } from '../components/auth/LoginForm/LoginForm';

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <LoginForm  />
    </div>
  );
}