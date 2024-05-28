import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  condition: boolean;
  to: string;
};

const ProtectedRoute = ({ condition, to, children }: ProtectedRouteProps) => {
  if (condition) {
    return <Navigate to={to} />;
  }

  return children;
};

export default ProtectedRoute;
