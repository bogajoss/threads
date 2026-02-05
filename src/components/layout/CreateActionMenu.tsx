import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateActionMenuProps {
  triggerClassName?: string;
}

const CreateActionMenu: React.FC<CreateActionMenuProps> = ({
  triggerClassName,
}) => {
  const navigate = useNavigate();

  return (
    <button
      aria-label="Create Post"
      onClick={() => navigate("/create")}
      className={cn(
        "flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg",
        triggerClassName
      )}
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
};

export default CreateActionMenu;
