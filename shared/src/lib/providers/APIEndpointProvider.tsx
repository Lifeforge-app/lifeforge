import { createContext, useContext } from "react";

const APIEndpointContext = createContext<string | null>(null);

export default function APIEndpointProvider({
  endpoint,
  children,
}: {
  endpoint: string;
  children: React.ReactNode;
}) {
  return <APIEndpointContext value={endpoint}>{children}</APIEndpointContext>;
}

export function useAPIEndpoint() {
  const context = useContext(APIEndpointContext);

  if (context === null) {
    throw new Error(
      "useAPIEndpoint must be used within an APIEndpointProvider"
    );
  }

  return context;
}
