import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/features/auth/AuthForm";
import { PageTransition } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PageTransition>
        <AuthForm
          type="login"
          onComplete={() => {
            // Check if onboarding is completed
            if (!currentUser?.onboarding_completed) {
              navigate("/onboarding");
            } else {
              navigate("/");
            }
          }}
          onSwitch={() => navigate("/register")}
        />
      </PageTransition>
    </div>
  );
};

export default LoginPage;
