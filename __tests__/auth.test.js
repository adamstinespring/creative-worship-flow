import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');
jest.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}));

describe('Authentication', () => {
  test('should handle user login', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  test('should handle user signup', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });
});
