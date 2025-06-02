import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/useToast';

export default function Layout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Creative Worship Flow
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
