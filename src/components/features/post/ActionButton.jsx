import React from "react";

const ActionButton = ({
  icon,
  count,
  label,
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
      className={`group flex items-center gap-x-1.5 text-[12px] sm:text-[13px] font-bold transition-all ${active ? activeColorClass : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
    >
      <div
        className={`rounded-full p-2 transition-colors ${active ? "" : "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"}`}
      >
        <Icon
          size={18}
          strokeWidth={active ? 2.5 : 2}
          className={active ? "fill-current" : ""}
        />
      </div>
      {label && <span className="hidden xs:inline">{label}</span>}
      {count !== undefined && count !== null && (
        <span className={active ? "font-bold" : ""}>{count || 0}</span>
      )}
    </button>
  );
};

export default ActionButton;
