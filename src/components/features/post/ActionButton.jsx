import React from "react";

const ActionButton = ({
  icon,
  count,
  onClick,
  active,
  activeColorClass = "text-violet-600",
}) => {
  const Icon = icon;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      className={`group flex items-center gap-x-2 text-[13px] font-medium transition-all ${active ? activeColorClass : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
    >
      <div
        className={`rounded-full p-2 transition-colors ${active ? "bg-current/10" : "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"}`}
      >
        <Icon
          size={18}
          strokeWidth={active ? 2.5 : 2}
          className={active ? "fill-current" : ""}
        />
      </div>
      {count !== undefined && count !== null && (
        <span className={active ? "font-bold" : ""}>{count || 0}</span>
      )}
    </button>
  );
};

export default ActionButton;
