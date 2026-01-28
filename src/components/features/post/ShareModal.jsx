import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import {
    Copy,
    Check,
    Twitter,
    Facebook,
    Linkedin,
    MessageSquare,
    Send,
    MoreHorizontal,
    Mail,
    Search,
    Users,
    Loader2
} from "lucide-react";
import {
    searchUsers,
    fetchFollowing
} from "@/lib/api/users";
import {
    getOrCreateConversation,
    sendMessage
} from "@/lib/api/messages";

/**
 * ShareModal: A premium, polished sharing interface.
 * Features: Social sharing, Link copying, and functional DM sharing.
 */
const ShareModal = ({ isOpen, onClose, url, title = "Share" }) => {
    const [copied, setCopied] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [sendingTo, setSendingTo] = useState(null); // ID of user being sent to
    const { addToast } = useToast();
    const { currentUser } = useAuth();

    // Fetch initial friends (following)
    const loadInitialFriends = useCallback(async () => {
        setLoadingFriends(true);
        try {
            const following = await fetchFollowing(currentUser.id, null, 10);
            setFriends(following);
        } catch (err) {
            console.error("Failed to fetch following:", err);
        } finally {
            setLoadingFriends(false);
        }
    }, [currentUser?.id]);

    useEffect(() => {
        if (isOpen && currentUser) {
            loadInitialFriends();
        } else {
            setSearchTerm("");
            setFriends([]);
        }
    }, [isOpen, currentUser, loadInitialFriends]);

    // Search logic
    const handleSearch = useCallback(async () => {
        setLoadingFriends(true);
        try {
            const results = await searchUsers(searchTerm);
            // Filter out self
            setFriends(results.filter(u => u.id !== currentUser.id));
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoadingFriends(false);
        }
    }, [searchTerm, currentUser?.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim() && isOpen) {
                handleSearch();
            } else if (!searchTerm.trim() && isOpen) {
                loadInitialFriends();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, isOpen, handleSearch, loadInitialFriends]);

    const handleCopy = async (e) => {
        if (e) e.stopPropagation();
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            addToast("Link copied to clipboard!", "success");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            addToast("Failed to copy link", "error");
        }
    };

    const handleSendToFriend = async (friend) => {
        if (!currentUser) return;
        setSendingTo(friend.id);
        try {
            const conversationId = await getOrCreateConversation(currentUser.id, friend.id);
            await sendMessage(conversationId, currentUser.id, url, "text");
            addToast(`Sent to ${friend.name || friend.handle}!`, "success");
        } catch (err) {
            console.error("Failed to send message:", err);
            addToast("Failed to send message", "error");
        } finally {
            setSendingTo(null);
        }
    };

    const shareOptions = [
        {
            name: "X",
            icon: Twitter,
            color: "bg-black text-white",
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "bg-[#1877F2] text-white",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            color: "bg-[#0A66C2] text-white",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
        {
            name: "WhatsApp",
            icon: MessageSquare,
            color: "bg-[#25D366] text-white",
            href: `https://wa.me/?text=${encodeURIComponent(url)}`,
        },
        {
            name: "Email",
            icon: Mail,
            color: "bg-zinc-600 text-white",
            href: `mailto:?body=${encodeURIComponent(url)}`,
        },
    ];

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url,
                });
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Native share failed:", err);
                }
            }
        } else {
            handleCopy();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-[420px] !p-0 overflow-hidden"
        >
            <div className="flex flex-col bg-white dark:bg-zinc-900 h-full">
                {/* Search for Friends */}
                <div className="px-5 pt-4 pb-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 group-focus-within:text-violet-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Real Friends List */}
                <div className="flex gap-4 overflow-x-auto px-5 py-4 no-scrollbar min-h-[100px] items-center">
                    {loadingFriends ? (
                        <div className="flex-1 flex justify-center">
                            <Loader2 size={24} className="animate-spin text-zinc-400" />
                        </div>
                    ) : friends.length > 0 ? (
                        friends.map((friend) => (
                            <button
                                key={friend.id}
                                onClick={() => handleSendToFriend(friend)}
                                disabled={sendingTo !== null}
                                className="flex flex-col items-center gap-1.5 shrink-0 group disabled:opacity-50"
                            >
                                <div className="relative">
                                    <div className="size-14 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                                        <img src={friend.avatar || `https://i.pravatar.cc/150?u=${friend.id}`} alt={friend.handle} className="size-full object-cover" />
                                    </div>
                                    {sendingTo === friend.id ? (
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                            <Loader2 size={16} className="animate-spin text-white" />
                                        </div>
                                    ) : (
                                        <div className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                                    )}
                                </div>
                                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[60px]">
                                    {friend.name?.split(" ")[0] || friend.handle}
                                </span>
                            </button>
                        ))
                    ) : (
                        <div className="flex-1 text-center py-2">
                            <span className="text-xs text-zinc-400">No people found</span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-5" />

                {/* Social Share Options */}
                <div className="grid grid-cols-5 gap-2 px-5 py-6">
                    {shareOptions.map((option) => (
                        <a
                            key={option.name}
                            href={option.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`size-12 ${option.color} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:-translate-y-1 shadow-md group-hover:shadow-lg`}>
                                <option.icon size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">
                                {option.name}
                            </span>
                        </a>
                    ))}
                    <button
                        onClick={handleNativeShare}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="size-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:-translate-y-1 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                            <MoreHorizontal size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">
                            More
                        </span>
                    </button>
                </div>

                {/* Copy Link Section */}
                <div className="px-5 pb-6">
                    <div className="relative group">
                        <input
                            type="text"
                            readOnly
                            value={url}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-4 pr-14 text-sm font-medium focus:outline-none transition-colors group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
                        />
                        <button
                            onClick={handleCopy}
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-2 shadow-sm ${copied
                                    ? "bg-emerald-500 text-white"
                                    : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} strokeWidth={3} />
                                    <span>Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} strokeWidth={3} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="px-5 pb-5">
                    <button
                        onClick={onClose}
                        className="relative flex items-center justify-center w-full py-4 bg-zinc-900 dark:bg-white rounded-2xl text-white dark:text-zinc-900 font-bold overflow-hidden group hover:shadow-xl hover:shadow-zinc-900/10 dark:hover:shadow-white/10 transition-all active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-2">
                            <span>Close</span>
                        </div>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;
