import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Creative Worship Flow
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered worship service planning for modern churches
        </p>
        <div className="space-x-4">
          <Link href="/signup" className="btn-primary">
            Start Free Trial
          </Link>
          <Link href="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
