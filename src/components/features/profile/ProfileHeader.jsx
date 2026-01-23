import React from 'react';
import {
    ArrowLeft,
    Search,
    MapPin,
    Link as LinkIcon,
    Calendar,
    MoreHorizontal,
    Mail,
    Bell,
    Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { useFollow } from '@/hooks/useFollow';

const ProfileHeader = ({ profile, currentUser, isCurrentUser, onEditProfile, showToast, isCommunity }) => {
    const { isFollowing, stats, loading, handleFollow } = useFollow(profile, currentUser?.id, showToast);

    return (
        <div className="flex flex-col">
            <div className="relative h-32 sm:h-48 w-full bg-zinc-200 dark:bg-zinc-800">
                {profile.cover && <img src={profile.cover} className="h-full w-full object-cover transition-opacity duration-500" alt="Cover" />}
                <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
                    <div className="p-1 bg-white dark:bg-black rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-black relative">
                        <Avatar className="size-24 sm:size-32">
                            <AvatarImage src={profile.avatar} alt={profile.handle} className="object-cover" />
                            <AvatarFallback className="text-4xl font-bold">{profile.handle?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-4 sm:p-6 pt-16 sm:pt-20 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-4">
                        {/* Name moved below avatar in mobile for more space */}
                    </div>
                    <div className="flex gap-2 shrink-0">
                        {isCurrentUser ? (
                            <Button variant="secondary" onClick={() => onEditProfile(profile)} className="text-sm px-5">Edit profile</Button>
                        ) : (
                            <>
                                <button className="rounded-full p-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 dark:border-zinc-800 transition-colors"><Mail size={20} /></button>
                                <button className="rounded-full p-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 dark:border-zinc-800 transition-colors"><Bell size={20} /></button>
                                <Button
                                    variant={isFollowing ? "secondary" : "primary"}
                                    onClick={handleFollow}
                                    className="text-sm px-6 min-w-[100px]"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : (isFollowing ? 'Following' : 'Follow')}
                                </Button>
                                <button className="rounded-full p-2 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"><MoreHorizontal size={20} /></button>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-xl sm:text-2xl font-extrabold truncate dark:text-white flex items-center gap-1">
                            {profile.name}
                            {profile.verified && <VerifiedBadge />}
                        </h3>
                    </div>
                    {!isCommunity && (
                        <div className="flex items-center space-x-3">
                            <span className="text-zinc-500 font-medium text-sm px-1.5 py-0.5 -ml-1.5 rounded-md dark:text-zinc-400">@{profile.handle}</span>
                        </div>
                    )}
                </div>

                <div className="whitespace-pre-line text-zinc-900 dark:text-zinc-100 leading-relaxed text-sm sm:text-[15px]">{profile.bio}</div>

                {(profile.website || profile.location) && (
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm pt-1">
                        {profile.location && (
                            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <MapPin size={14} />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile.website && (
                            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <LinkIcon size={14} />
                                <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline font-semibold text-black dark:text-white">{profile.website}</a>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-4 sm:gap-6 text-sm pt-2">
                    {isCommunity ? (
                        <button className="flex gap-x-1 hover:underline group"><span className="font-bold text-zinc-900 dark:text-white group-hover:text-violet-600">{profile.members}</span><span className="text-zinc-500 dark:text-zinc-400">Members</span></button>
                    ) : (
                        <>
                            <button className="flex gap-x-1 hover:underline group"><span className="font-bold text-zinc-900 dark:text-white group-hover:text-violet-600">{stats.following}</span><span className="text-zinc-500 dark:text-zinc-400">Following</span></button>
                            <button className="flex gap-x-1 hover:underline group"><span className="font-bold text-zinc-900 dark:text-white group-hover:text-violet-600">{stats.followers}</span><span className="text-zinc-500 dark:text-zinc-400">Followers</span></button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
