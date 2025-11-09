/**
 * Example component demonstrating how to use authenticated API calls
 * with Keycloak JWT token
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { useKeycloak } from "@/hooks/useKeycloak";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiData {
  id: number;
  name: string;
  value: string;
}

export const ExampleApiUsage = () => {
  const { username, email, roles, token } = useKeycloak();
  const { get, post } = useAuthenticatedFetch();
  const [data, setData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example 1: Fetch data with useAuthenticatedFetch hook
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await get<ApiData[]>("/data");
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Post data with authentication
  const createData = async () => {
    try {
      const newItem = await post<ApiData>("/data", {
        name: "New Item",
        value: "Some value",
      });
      setData([...data, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create data");
    }
  };

  // Example 3: Direct fetch with manual token
  const fetchWithManualToken = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/custom", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      console.log("Result:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Information (from Keycloak JWT)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Roles:</strong> {roles.join(", ")}</p>
          <p className="text-xs text-muted-foreground break-all">
            <strong>Token (first 50 chars):</strong> {token?.substring(0, 50)}...
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Calls with JWT Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={fetchData} disabled={loading}>
              {loading ? "Loading..." : "Fetch Data (GET)"}
            </Button>
            <Button onClick={createData} variant="secondary">
              Create Data (POST)
            </Button>
            <Button onClick={fetchWithManualToken} variant="outline">
              Manual Token Fetch
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              Error: {error}
            </div>
          )}

          {data.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Data:</h3>
              <div className="space-y-1">
                {data.map((item) => (
                  <div key={item.id} className="p-2 bg-muted rounded">
                    {item.name}: {item.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>React Query Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
{`import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

function MyComponent() {
  const { get } = useAuthenticatedFetch();

  const { data, isLoading, error } = useQuery({
    queryKey: ["myData"],
    queryFn: () => get("/api/data"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
