import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/features/auth/AuthForm";
import { PageTransition } from "@/components/layout";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PageTransition>
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
