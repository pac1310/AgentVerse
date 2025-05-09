import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type DummyUser = {
  id: string;
  email: string;
  name: string;
};

type DummySession = {
  user: DummyUser;
  token: string;
};

type AuthContextType = {
  session: DummySession | null;
  loading: boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DummySession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a session in localStorage
    const checkSession = () => {
      const storedSession = localStorage.getItem('dummyAuth');
      if (storedSession) {
        try {
          setSession(JSON.parse(storedSession));
        } catch (error) {
          console.error('Failed to parse auth session', error);
          localStorage.removeItem('dummyAuth');
        }
      }
      setLoading(false);
    };

    checkSession();

    // Listen for storage events (in case of login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dummyAuth') {
        if (e.newValue) {
          setSession(JSON.parse(e.newValue));
        } else {
          setSession(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signOut = () => {
    localStorage.removeItem('dummyAuth');
    setSession(null);
  };

  const value = {
    session,
    loading,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 