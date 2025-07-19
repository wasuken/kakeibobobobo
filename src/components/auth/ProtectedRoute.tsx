import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LoginForm } from "./LoginForm";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginForm />;
  }

  return <>{children}</>;
};
