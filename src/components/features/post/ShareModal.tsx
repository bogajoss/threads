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
  Mail,
  Search,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  getOrCreateConversation,
  sendMessage,
  fetchConversations,
} from "@/lib/api/messages";
import type { User } from "@/types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

/**
 * ShareModal: A premium, polished sharing interface.
 * Features: Social sharing, Link copying, and functional DM sharing.
 */
const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
  title = "Share",
}) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null); // ID of user being sent to
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  // Fetch initial friends (people you have conversations with)
  const loadInitialFriends = useCallback(async () => {
    if (!currentUser) return;
    setLoadingFriends(true);
    try {
      const conversations = await fetchConversations(currentUser.id);
      const users = conversations
        .map((c) => c.user)
        .filter((u): u is User => u !== null);
      setFriends(users.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
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

  // Search logic: Limit to searching within people you already message
  const handleSearch = useCallback(async () => {
    if (!currentUser) return;
    setLoadingFriends(true);
    try {
      // First get all conversations to have the current list
      const conversations = await fetchConversations(currentUser.id);
      const users = conversations
        .map((c) => c.user)
        .filter(
          (u): u is User =>
            u !== null &&
            (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.handle.toLowerCase().includes(searchTerm.toLowerCase())),
        );
      setFriends(users);
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

  const handleCopy = async (e?: React.MouseEvent) => {
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

  const handleSendToFriend = async (friend: User) => {
    if (!currentUser) return;
    setSendingTo(friend.id);
    try {
      const conversationId = await getOrCreateConversation(
        currentUser.id,
        friend.id,
      );
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
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url,
      )}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2] text-white",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}`,
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
      } catch (err: any) {
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
      <div className="flex h-full flex-col bg-white dark:bg-zinc-900">
        {/* Search for Friends */}
        <div className="px-5 pb-2 pt-4">
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-violet-500" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border-none bg-zinc-100 py-2.5 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-violet-500/20 outline-none dark:bg-zinc-800/50"
            />
          </div>
        </div>

        {/* Real Friends List */}
        <div className="no-scrollbar flex min-h-[100px] items-center gap-4 overflow-x-auto px-5 py-4">
          {loadingFriends ? (
            <div className="flex flex-1 justify-center">
              <Loader2 size={24} className="animate-spin text-zinc-400" />
            </div>
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => handleSendToFriend(friend)}
                disabled={sendingTo !== null}
                className="group flex shrink-0 flex-col items-center gap-1.5 disabled:opacity-50"
              >
                <div className="relative">
                  <div className="size-14 overflow-hidden rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105 bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-900">
                    <img
                      src={
                        friend.avatar ||
                        `https://i.pravatar.cc/150?u=${friend.id}`
                      }
                      alt={friend.handle}
                      className="size-full object-cover"
                    />
                  </div>
                  {sendingTo === friend.id && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                      <Loader2 size={16} className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <span className="max-w-[60px] truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                  {friend.name?.split(" ")[0] || friend.handle}
                </span>
              </button>
            ))
          ) : (
            <div className="flex-1 py-2 text-center">
              <span className="text-xs text-zinc-400">No people found</span>
            </div>
          )}
        </div>

        <div className="mx-5 h-px bg-zinc-100 dark:bg-zinc-800" />

        {/* Social Share Options */}
        <div className="grid grid-cols-5 gap-2 px-5 py-6">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={`size-12 ${option.color} flex items-center justify-center rounded-2xl shadow-md transition-all group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-lg`}
              >
                <option.icon size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500 dark:text-zinc-400">
                {option.name}
              </span>
            </a>
          ))}
          <button
            onClick={handleNativeShare}
            className="group flex flex-col items-center gap-2"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-600 shadow-sm transition-all group-hover:-translate-y-1 group-hover:scale-110 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <MoreHorizontal size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500 dark:text-zinc-400">
              More
            </span>
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="px-5 pb-6">
          <div className="group relative">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3.5 pl-4 pr-14 text-sm font-medium transition-colors focus:outline-none group-hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:group-hover:border-zinc-700"
            />
            <button
              onClick={handleCopy}
              className={`absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl h-10 px-4 text-xs font-bold shadow-sm transition-all active:scale-95 ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-900 text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
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
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 py-4 font-bold text-white transition-all hover:shadow-xl hover:shadow-zinc-900/10 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:shadow-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
