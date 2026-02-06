import { useNavigate } from "react-router-dom";
import {
  Stories,
  StoriesContent,
  Story,
  StoryAuthor,
  StoryAuthorImage,
  StoryAuthorName,
  StoryOverlay,
  StoryVideo,
} from "@/components/kibo-ui/stories";
import { useReels } from "@/hooks/pages/useReels";
import { Loader2 } from "lucide-react";

const ReelsRow = () => {
  const navigate = useNavigate();
  const { reels, loading } = useReels();

  if (loading && reels.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin text-violet-500" />
      </div>
    );
  }

  if (reels.length === 0) return null;

  return (
    <div className="my-4 border-y border-zinc-100 bg-zinc-50/30 py-4 dark:border-zinc-800 dark:bg-zinc-900/10">
      <div className="mb-3 px-4 flex items-center justify-between">
        <h3 className="font-bold text-lg">Recommended Reels</h3>
        <button
          onClick={() => navigate("/reels")}
          className="text-sm font-semibold text-violet-600 hover:underline"
        >
          View all
        </button>
      </div>
      <Stories>
        <StoriesContent>
          {reels.slice(0, 10).map((reel) => (
            <Story
              className="aspect-[9/16] w-[150px] sm:w-[180px]"
              key={reel.id}
              onClick={() => navigate(`/reels?id=${reel.id}`)}
            >
              <StoryVideo src={reel.media?.[0]?.url || ""} />
              <StoryOverlay />
              <StoryAuthor>
                <StoryAuthorImage
                  name={reel.user?.handle}
                  src={reel.user?.avatar}
                />
                <StoryAuthorName>{reel.user?.handle}</StoryAuthorName>
              </StoryAuthor>
            </Story>
          ))}
        </StoriesContent>
      </Stories>
    </div>
  );
};

export default ReelsRow;
