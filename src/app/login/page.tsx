'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
    router.push('/profile');
  };

  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-200 rounded-lg font-sans">
      <h1 className="text-center mb-6 text-2xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="flex flex-col text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </label>
        <label className="flex flex-col text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </label>
        <button 
          type="submit"
          className="px-4 py-3 bg-blue-600 text-white text-base border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center">
        No account?{' '}
        <button 
          onClick={handleSignupRedirect} 
          className="text-blue-600 bg-transparent border-none cursor-pointer hover:text-blue-800 underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}