import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/features/auth/AuthForm";
import { PageTransition } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading || currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PageTransition noBackground className="flex items-center justify-center">
        <AuthForm
          type="signup"
          onComplete={() => {
            navigate("/");
          }}
          onSwitch={() => navigate("/login")}
        />
      </PageTransition>
    </div>
  );
};

export default RegisterPage;
