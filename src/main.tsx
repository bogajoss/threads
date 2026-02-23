import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { PresenceProvider } from "@/context/PresenceContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { PostProvider } from "@/context/PostContext";
import { LightboxProvider } from "@/context/LightboxContext";
import { ReportProvider } from "@/context/ReportContext";
import "plyr/dist/plyr.css";
import "@/index.css";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <PresenceProvider>
                <PostProvider>
                  <ToastProvider>
                    <ReportProvider>
                      <LightboxProvider>
                        <App />
                      </LightboxProvider>
                    </ReportProvider>
                  </ToastProvider>
                </PostProvider>
              </PresenceProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
}
