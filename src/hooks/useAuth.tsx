
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Mock auth context - will be replaced with Supabase Auth
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'lecturer' | 'student';
  department_id?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "mock-user-id",
    email: "john.doe@university.edu",
    name: "John Doe",
    role: "admin",
    department_id: "cs-dept-id",
    avatar_url: ""
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // TODO: Replace with Supabase auth
    console.log('Signing in:', email);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    // TODO: Replace with Supabase auth
    setUser(null);
    setLoading(false);
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    // TODO: Replace with Supabase auth
    console.log('Signing up:', email, userData);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
