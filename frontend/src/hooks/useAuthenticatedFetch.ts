import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook for making authenticated API requests with Keycloak JWT token
 */
export const useAuthenticatedFetch = () => {
  const { getToken } = useAuth();

  /**
   * Makes an authenticated fetch request with the JWT token
   * @param url - The URL to fetch
   * @param options - Fetch options (method, body, etc.)
   * @returns Promise with the response
   */
  const authenticatedFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  /**
   * Makes an authenticated GET request
   */
  const get = async <T = any>(url: string): Promise<T> => {
    const response = await authenticatedFetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`GET request failed: ${response.statusText}`);
    }
    return response.json();
  };

  /**
   * Makes an authenticated POST request
   */
  const post = async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await authenticatedFetch(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`POST request failed: ${response.statusText}`);
    }
    return response.json();
  };

  /**
   * Makes an authenticated PUT request
   */
  const put = async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await authenticatedFetch(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`PUT request failed: ${response.statusText}`);
    }
    return response.json();
  };

  /**
   * Makes an authenticated DELETE request
   */
  const del = async <T = any>(url: string): Promise<T> => {
    const response = await authenticatedFetch(url, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`DELETE request failed: ${response.statusText}`);
    }
    return response.json();
  };

  return {
    authenticatedFetch,
    get,
    post,
    put,
    delete: del,
  };
};
