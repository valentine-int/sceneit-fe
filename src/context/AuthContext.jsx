import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // AUTH STATE

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // CHECK CURRENT USER
  // =========================

  useEffect(() => {

    async function checkCurrentUser() {

      try {

        const result = await getCurrentUser();

        setUser(result.user);

      } catch (error) {

        setUser(null);

      } finally {

        setIsLoading(false);

      }
    }

    checkCurrentUser();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// USE AUTH
export function useAuth() {
  return useContext(AuthContext);
}