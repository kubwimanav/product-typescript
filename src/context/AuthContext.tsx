import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: number;
  username?: string;
  email?: string;
  token?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing auth token on app load
    const checkAuthToken = () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");

        if (token) {
          // You might want to validate the token with your API here
          // For now, we'll just assume it's valid if it exists
          // In a real app, you'd decode the JWT or make an API call to validate

          // For demo purposes, setting a basic user object
          // You should replace this with actual token validation/user fetching
          setUser({
            id: 1,
            username: "user", // You'd get this from token or API call
            token: token,
          });
        }
      } catch (err) {
        console.error("Failed to check auth token:", err);
        // Clear invalid tokens
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  const logout = () => {
    // Clear user state
    setUser(null);

    // Clear tokens from storage
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    // You might also want to invalidate the token on the server
    // await api.post('/logout'); // if your API supports it
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
