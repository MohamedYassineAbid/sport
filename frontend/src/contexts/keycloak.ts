import Keycloak from "keycloak-js";

// Initialize Keycloak instance
// Use environment variables if available, otherwise fall back to defaults
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "sportsviz",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "sportsviz-client",
});

export default keycloak;
