import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Button from "@/components/ui/Button";

const NotFound = ({ 
  title = "Not Found", 
  message = "The content you are looking for doesn't exist or has been removed.",
  icon = AlertCircle,
  showHome = true,
  showBack = true
}) => {
  const navigate = useNavigate();
  const IconComponent = icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-full mb-6">
        <IconComponent size={48} className="text-zinc-400 dark:text-zinc-600" />
      </div>
      
      <h2 className="text-2xl font-black mb-2 dark:text-white">
        {title}
      </h2>
      
      <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mb-8 leading-relaxed">
        {message}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {showBack && (
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            className="rounded-full px-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
        )}
        
        {showHome && (
          <Button 
            onClick={() => navigate("/")}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full px-6"
          >
            <Home size={18} className="mr-2" />
            Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
