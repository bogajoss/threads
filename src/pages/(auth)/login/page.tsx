import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/features/auth/AuthForm";
import { PageTransition } from "@/components/layout";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PageTransition>
        <AuthForm
          type="login"
          onComplete={() => {
            navigate("/");
          }}
          onSwitch={() => navigate("/register")}
        />
      </PageTransition>
    </div>
  );
};

export default LoginPage;
