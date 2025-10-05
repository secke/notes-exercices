import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/notes" />;
  }

  return <Redirect href="/(auth)/login" />;
}