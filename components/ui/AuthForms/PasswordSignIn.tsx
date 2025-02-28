'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8 max-w-md mx-auto bg-white  p-6">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="font-medium text-gray-900">
              Email
            </label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
            />

            <label htmlFor="password" className="font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <Button
            variant="slim"
            type="submit"
            className="w-full bg-green-500 text-white font-semibold p-3 rounded-lg hover:bg-green-600 transition"
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </div>
      </form>

      <p className="text-center text-gray-600 text-sm">
        <Link
          href="/signin/forgot_password"
          className="hover:text-blue-600 transition"
        >
          Forgot your password?
        </Link>
      </p>

      {allowEmail && (
        <p className="text-center text-gray-600 text-sm">
          <Link
            href="/signin/email_signin"
            className="hover:text-blue-600 transition"
          >
            Sign in via magic link
          </Link>
        </p>
      )}

      <p className="text-center text-gray-600 text-sm">
        Don't have an account?{' '}
        <Link
          href="/signin/signup"
          className="text-blue-500 font-medium hover:text-blue-600 transition"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
