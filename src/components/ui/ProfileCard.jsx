import React from 'react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import Button from '@/components/ui/Button';

const ProfileCard = ({ profile, onUserClick, isCommunity = false }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group cursor-pointer" onClick={() => onUserClick(profile.handle)}>
            <div className="flex items-center gap-3">
                <img 
                    src={profile.avatar} 
                    className={`size-12 object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm ${isCommunity ? 'rounded-2xl' : 'rounded-full'}`} 
                    alt={profile.handle} 
                />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-zinc-900 dark:text-white group-hover:underline leading-none">
                            {profile.name}
                        </span>
                        {profile.verified && <VerifiedBadge />}
                    </div>
                    <span className="text-sm text-zinc-500 mt-0.5">@{profile.handle}</span>
                    {isCommunity && profile.members && (
                        <span className="text-xs text-zinc-400 mt-1">{profile.members} members</span>
                    )}
                    {!isCommunity && profile.followers && (
                        <span className="text-xs text-zinc-400 mt-1">{profile.followers} followers</span>
                    )}
                </div>
            </div>
            <Button variant="outline" className="!w-auto !py-1.5 !px-4 text-sm font-bold rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={(e) => { e.stopPropagation(); }}>
                {isCommunity ? 'Join' : 'Follow'}
            </Button>
        </div>
    );
};

export default ProfileCard;
