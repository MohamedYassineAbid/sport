import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Keycloak from "keycloak-js";
import keycloak from "./keycloak";
import { syncUserData, UserData } from "@/services/userService";

interface AuthContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  loading: boolean;
  logout: () => void;
  getUsername: () => string | undefined;
  getToken: () => string | undefined;
  getUserData: () => UserData | null;
}

const AuthContext = createContext<AuthContextType>({
  keycloak: null,
  authenticated: false,
  loading: true,
  logout: () => {},
  getUsername: () => undefined,
  getToken: () => undefined,
  getUserData: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Keycloak
    keycloak
      .init({
        onLoad: "login-required", // Redirect to login if not authenticated
        checkLoginIframe: false, // Disable iframe check for simpler setup
        pkceMethod: "S256", // Use PKCE for better security
      })
      .then((auth) => {
        setAuthenticated(auth);
        setLoading(false);

        // Setup token refresh
        if (auth) {
          // Sync user data to PostgreSQL on successful authentication
          syncUserToDatabase();

          // Refresh token every 60 seconds
          setInterval(() => {
            keycloak
              .updateToken(70)
              .then((refreshed) => {
                if (refreshed) {
                  console.log("Token refreshed");
                }
              })
              .catch(() => {
                console.error("Failed to refresh token");
              });
          }, 60000);
        }
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setLoading(false);
      });
  }, []);

  const syncUserToDatabase = async () => {
    if (!keycloak.token || !keycloak.tokenParsed) {
      console.warn("No token available for syncing user data");
      return;
    }

    const userData: UserData = {
      keycloak_id: keycloak.tokenParsed.sub || "",
      username: keycloak.tokenParsed.preferred_username || "",
      email: keycloak.tokenParsed.email || "",
      first_name: keycloak.tokenParsed.given_name,
      last_name: keycloak.tokenParsed.family_name,
      roles: keycloak.tokenParsed.realm_access?.roles || [],
    };

    try {
      const result = await syncUserData(userData, keycloak.token);
      if (result.success) {
        console.log("User data synced to database successfully");
      } else {
        console.error("Failed to sync user data:", result.error);
      }
    } catch (error) {
      console.error("Error syncing user data:", error);
    }
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const getUsername = () => {
    return keycloak.tokenParsed?.preferred_username;
  };

  const getToken = () => {
    return keycloak.token;
  };

  const getUserData = (): UserData | null => {
    if (!keycloak.tokenParsed) return null;

    return {
      keycloak_id: keycloak.tokenParsed.sub || "",
      username: keycloak.tokenParsed.preferred_username || "",
      email: keycloak.tokenParsed.email || "",
      first_name: keycloak.tokenParsed.given_name,
      last_name: keycloak.tokenParsed.family_name,
      roles: keycloak.tokenParsed.realm_access?.roles || [],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ keycloak, authenticated, loading, logout, getUsername, getToken, getUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
