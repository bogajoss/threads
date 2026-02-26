import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import {
  Twitter,
  Facebook,
  Linkedin,
  MessageSquare,
  Mail,
  Search,
  MoreHorizontal,
} from "lucide-react";
import {
  getOrCreateConversation,
  sendMessage,
  fetchConversations,
} from "@/lib/api/messages";
import type { User } from "@/types";
import { copyToClipboard } from "@/lib/utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  overlayClassName?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
  title = "Share",
  overlayClassName,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const { addToast } = useToast();
  const { currentUser } = useAuth();

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
  }, [currentUser]);

  const handleSearch = useCallback(async () => {
    if (!currentUser) return;
    setLoadingFriends(true);
    try {
      const conversations = await fetchConversations(currentUser.id);
      const users = conversations
        .map((c) => c.user)
        .filter(
          (u): u is User =>
            u !== null &&
            (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.handle?.toLowerCase().includes(searchTerm.toLowerCase())),
        );
      setFriends(users);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoadingFriends(false);
    }
  }, [searchTerm, currentUser]);

  useEffect(() => {
    if (!isOpen || !currentUser) {
      setSearchTerm("");
      setFriends([]);
      return;
    }

    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        loadInitialFriends();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, currentUser, handleSearch, loadInitialFriends]);

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await copyToClipboard(url);
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
      className="max-w-[360px] overflow-hidden rounded-[32px] border border-black/10 bg-white/75 p-0 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75 sm:max-w-[380px]"
      overlayClassName={overlayClassName}
    >
      <div className="flex h-full flex-col">
        {/* Header Title */}
        <div className="flex items-center justify-center pt-6 pb-2">
          <h2 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
        </div>

        {/* Search */}
        <div className="px-5 py-3">
          <div className="group relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-violet-500" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-black/5 bg-black/5 py-3 pl-11 pr-4 text-[15px] outline-none transition-all focus:ring-4 focus:ring-violet-500/10 dark:border-white/5 dark:bg-white/5 dark:focus:bg-black/50"
            />
          </div>
        </div>

        {/* Friends Row */}
        <div className="no-scrollbar flex min-h-[110px] items-center gap-4 overflow-x-auto px-5 py-4">
          {loadingFriends ? (
            <div className="flex flex-1 justify-center">
              <span className="animate-pulse text-[13px] font-medium text-zinc-400">
                Loading...
              </span>
            </div>
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => handleSendToFriend(friend)}
                disabled={sendingTo !== null}
                className="group flex shrink-0 flex-col items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <div className="relative">
                  <div className="size-16 overflow-hidden rounded-full border-2 border-white/50 shadow-sm dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={
                        friend.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.handle}`
                      }
                      alt={friend.handle}
                      className="size-full object-cover"
                    />
                  </div>
                  {sendingTo === friend.id && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                      <span className="animate-pulse text-white font-bold">...</span>
                    </div>
                  )}
                </div>
                <span className="max-w-[70px] truncate text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
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

        <div className="mx-5 h-px bg-black/5 dark:bg-white/5" />

        {/* Social Grid */}
        <div className="grid grid-cols-5 gap-3 px-5 py-6">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2.5"
            >
              <div
                className={`size-12 ${option.color} flex items-center justify-center rounded-[18px] shadow-sm ring-1 ring-black/5 transition-all group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg dark:ring-white/5`}
              >
                <option.icon size={22} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80">
                {option.name}
              </span>
            </a>
          ))}
          <button
            onClick={handleNativeShare}
            className="group flex flex-col items-center gap-2.5"
          >
            <div className="flex size-12 items-center justify-center rounded-[18px] border border-black/10 bg-white/50 text-zinc-600 shadow-sm transition-all group-hover:-translate-y-1 group-hover:scale-105 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <MoreHorizontal size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500/80 dark:text-zinc-400/80">
              More
            </span>
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="px-5 pb-6">
          <div className="group relative flex items-center overflow-hidden rounded-2xl border border-black/10 bg-white/40 dark:border-white/10 dark:bg-black/20">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full bg-transparent py-4 pl-4 pr-16 text-[14px] font-medium text-zinc-600 outline-none dark:text-zinc-300"
            />
            <button
              onClick={handleCopy}
              className={`absolute right-1 text-[13px] font-bold active:scale-95 transition-all px-4 h-10 rounded-xl leading-none ${copied
                ? "text-emerald-500"
                : "text-violet-600 hover:text-violet-700 dark:text-violet-400"
                }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Close Button (Actionsheet style) */}
        <div className="border-t border-black/10 dark:border-white/10">
          <button
            onClick={onClose}
            className="flex h-16 w-full items-center justify-center text-[19px] font-medium text-zinc-500 transition-colors active:bg-black/5 dark:text-zinc-400 dark:active:bg-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
