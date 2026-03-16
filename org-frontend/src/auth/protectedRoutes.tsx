import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}: {children: React.ReactNode;}) {
 const { accounts, inProgress } = useMsal();

if (inProgress !== "none")  {
    return <div>Loading...</div>;
  }
if (!accounts.length) {
  return <Navigate to="/sign-in" replace />;
}

  return children;
}
