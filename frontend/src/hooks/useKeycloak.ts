import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook to access Keycloak user information and methods
 */
export const useKeycloak = () => {
  const { keycloak, authenticated, loading, logout, getUsername, getToken } = useAuth();

  return {
    // Keycloak instance
    keycloak,
    
    // Authentication state
    authenticated,
    loading,
    
    // User information
    username: getUsername(),
    email: keycloak?.tokenParsed?.email,
    firstName: keycloak?.tokenParsed?.given_name,
    lastName: keycloak?.tokenParsed?.family_name,
    fullName: keycloak?.tokenParsed?.name,
    roles: keycloak?.tokenParsed?.realm_access?.roles || [],
    
    // Token
    token: getToken(),
    
    // Methods
    logout,
    
    // Helper to check if user has a specific role
    hasRole: (role: string) => {
      const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
      return roles.includes(role);
    },
    
    // Helper to check if user has any of the specified roles
    hasAnyRole: (roles: string[]) => {
      const userRoles = keycloak?.tokenParsed?.realm_access?.roles || [];
      return roles.some(role => userRoles.includes(role));
    },
  };
};
