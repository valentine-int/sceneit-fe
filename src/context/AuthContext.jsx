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

  // CHECK CURRENT USER

  useEffect(() => {

    async function checkCurrentUser() {

      // Skip network call entirely if there's no token — avoids noisy 401 on every
      // fresh page load for logged-out users (both cookie-only & localStorage flows).
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {

        const result = await getCurrentUser();

        setUser(result.user);

      } catch (error) {

        // Token exists but is invalid/expired — clean it up.
        localStorage.removeItem('token');
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