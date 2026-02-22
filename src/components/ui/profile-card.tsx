import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface ProfileCardProps {
  profile: {
    id?: string;
    name?: string;
    handle?: string;
    avatar?: string | null;
    bio?: string | null;
    member_count?: number;
    membersCount?: number;
  };
  onUserClick?: (handle: string) => void;
  isCommunity?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onUserClick,
  isCommunity = false,
}) => {
  const handle = profile.handle ?? "";
  const title = profile.name || handle || "Unknown";
  const subtitle = isCommunity
    ? `${profile.membersCount ?? profile.member_count ?? 0} members`
    : `@${handle}`;

  return (
    <button
      type="button"
      onClick={() => handle && onUserClick?.(handle)}
      className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
    >
      <Avatar className="size-11 shrink-0">
        <AvatarImage src={profile.avatar ?? undefined} alt={title} />
        <AvatarFallback>{title.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        {profile.bio ? (
          <p className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
            {profile.bio}
          </p>
        ) : null}
      </div>
    </button>
  );
};

export default ProfileCard;
