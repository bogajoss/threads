import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Lock,
  Check,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Button from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  fetchProfiles,
  toggleFollow,
  searchUsers,
  updateProfile,
} from "@/lib/api";
import { useFollow } from "@/hooks/useFollow";
import type { User } from "@/types/index";
import { useToast } from "@/context/ToastContext";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      updateOnboardingStatus();
    }
  };

  const updateOnboardingStatus = async () => {
    if (!currentUser) return;
    try {
      await updateProfile(currentUser.id, { onboarding_completed: true });
      navigate("/feed");
    } catch (error) {
      console.error("Failed to update onboarding status", error);
      addToast("Failed to complete onboarding, skipping layout...", "error");
      navigate("/feed"); // Navigate anyway
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // Don't allow going back from step 1 to nothing if it's mandatory
      // But maybe they want to logout?
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <FollowStep
            key="step1"
            onNext={handleNext}
            onBack={handleBack}
            currentUser={currentUser}
          />
        )}
        {step === 2 && (
          <HowItWorksStep
            key="step2"
            onNext={handleNext}
            onBack={handleBack}
            isLoading={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 1: FOLLOW ACCOUNTS
// -----------------------------------------------------------------------------

function FollowStep({
  onNext,
  currentUser,
}: {
  onNext: () => void;
  onBack: () => void;
  currentUser: User;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suggested users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["onboarding-users", searchQuery],
    queryFn: async () => {
      if (searchQuery.length > 2) {
        return searchUsers(searchQuery);
      }
      return fetchProfiles(null, 20); // Fetch recent 20 users
    },
  });

  // Filter out current user JUST IN CASE
  const filteredUsers = users.filter((u) => u.id !== currentUser.id);

  // Handle follow all
  const [isFollowingAll, setIsFollowingAll] = useState(false);

  const followAll = async () => {
    setIsFollowingAll(true);
    try {
      // This is a rough valid implementation for client-side batching
      // Ideally this should be a backend function to avoid rate limits/latency
      const promises = filteredUsers.map((u) =>
        toggleFollow(currentUser.id, u.id),
      );
      await Promise.allSettled(promises);

      // Invalidate queries to update UI
      queryClient.invalidateQueries({ queryKey: ["isFollowing"] });
      addToast("Followed all users!", "success");

      setTimeout(() => {
        onNext();
      }, 800);
    } catch {
      addToast("Failed to follow some users", "error");
    } finally {
      setIsFollowingAll(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-screen max-h-screen w-full md:max-w-2xl mx-auto p-4 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="w-10"></div>
        <button
          onClick={onNext}
          className="flex items-center text-zinc-900 dark:text-white ml-auto hover:opacity-70 transition"
        >
          <span className="text-sm md:text-base font-medium">Next</span>
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-1" />
        </button>
      </div>

      {/* Title */}
      <div className="mb-6 md:mb-8 text-center space-y-1 md:space-y-2">
        <h1 className="text-xl md:text-3xl font-bold leading-tight">
          Follow creators and communities
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm">
          Build your feed with people and communities you love
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 md:mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          <Search className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <input
          type="text"
          placeholder="Search creators..."
          className="w-full h-11 md:h-12 rounded-lg md:rounded-xl bg-zinc-100 dark:bg-zinc-900 pl-11 pr-4 text-sm md:text-[15px] outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto -mx-2 md:-mx-4 px-2 md:px-4 pb-24 space-y-3 md:space-y-4 scrollbar-hide">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          filteredUsers.map((user) => (
            <UserItem key={user.id} user={user} currentUser={currentUser} />
          ))
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-10 text-sm md:text-base">
            No creators found
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-4 md:bottom-8 left-0 right-0 px-4 md:px-8 max-w-2xl mx-auto">
        <Button
          onClick={followAll}
          className="w-full text-sm md:text-[15px] h-11 md:h-12"
          disabled={isFollowingAll || isLoading || filteredUsers.length === 0}
        >
          {isFollowingAll ? (
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          ) : (
            "Follow all"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

function UserItem({ user, currentUser }: { user: User; currentUser: User }) {
  const { isFollowing, handleFollow } = useFollow(user, currentUser.id);

  return (
    <div className="flex items-center justify-between py-2 md:py-3 px-2 md:px-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        <Avatar className="w-10 h-10 md:w-12 md:h-12 border border-zinc-100 dark:border-zinc-800 shrink-0">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.handle[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-semibold text-sm md:text-[15px] leading-tight truncate">
              {user.handle}
            </span>
            {user.verified && (
              <div className="bg-blue-500 rounded-full p-[2px] shrink-0">
                <Check className="w-2 h-2 text-white stroke-[3px]" />
              </div>
            )}
          </div>
          <span className="text-zinc-500 text-xs md:text-[14px] leading-tight truncate">
            {user.name}
          </span>
        </div>
      </div>
      <Button
        variant={isFollowing ? "outline" : "primary"}
        className={cn(
          "h-9 md:h-10 px-4 md:px-6 text-xs md:text-sm font-semibold border-zinc-200 dark:border-zinc-700 transition-all shrink-0 ml-2 md:ml-4",
          isFollowing && "text-zinc-500 dark:text-zinc-400",
        )}
        onClick={() => handleFollow()}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// STEP 2: HOW IT WORKS
// -----------------------------------------------------------------------------

function HowItWorksStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}) {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    await onNext();
    // setIsLoading(false); // Usually we navigate away, so this might not be needed, but for safety
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-screen max-h-screen w-full md:max-w-2xl mx-auto p-4 md:p-8 relative"
    >
      {/* Header */}
      <div className="flex items-center mb-4 md:mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-zinc-900 dark:text-white hover:opacity-70 transition"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-sm md:text-base font-medium">Back</span>
        </button>
      </div>

      {/* Title */}
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">Welcome to Sysm</h1>
      </div>

      {/* Info Items Grid */}
      <div className="space-y-6 md:space-y-8 flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Item 1 */}
        <div className="flex gap-3 md:gap-4">
          <div className="mt-0.5 md:mt-1">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-violet-600 dark:text-violet-400 shrink-0" />
          </div>

          <div className="space-y-1 md:space-y-2 min-w-0">
            <h3 className="font-semibold text-sm md:text-base">
              Express yourself
            </h3>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
              Share your thoughts, life moments, and connect with communities.
              Post anything from text to multimedia content.
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex gap-3 md:gap-4">
          <div className="mt-0.5 md:mt-1">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400 shrink-0" />
          </div>
          <div className="space-y-1 md:space-y-2 min-w-0">
            <h3 className="font-semibold text-sm md:text-base">
              Discover & Connect
            </h3>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
              Follow creators, join communities, and engage with content that
              matters. Build meaningful connections with people worldwide.
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex gap-3 md:gap-4">
          <div className="mt-0.5 md:mt-1">
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <div className="space-y-1 md:space-y-2 min-w-0">
            <h3 className="font-semibold text-sm md:text-base">
              Privacy & Safety
            </h3>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
              Your data is yours. We prioritize privacy and security. Control
              what you share and who sees it.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-4 md:bottom-8 left-0 right-0 px-4 md:px-8 max-w-2xl mx-auto">
        <Button
          onClick={handleJoin}
          className="w-full text-sm md:text-[15px] h-11 md:h-12"
          disabled={isJoining}
        >
          {isJoining ? (
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          ) : (
            "Join Sysm"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
