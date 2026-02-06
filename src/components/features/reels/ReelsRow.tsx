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
import { Loader2, Play } from "lucide-react";

interface ReelsRowProps {
  index?: number;
}

const ReelsRow: React.FC<ReelsRowProps> = ({ index = 0 }) => {
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

  const startIndex = (index % Math.max(1, Math.floor(reels.length / 5))) * 5;
  const displayReels = reels.slice(startIndex, startIndex + 10);

  return (
    <div className="my-4 border-y border-zinc-100 bg-zinc-50/30 py-4 dark:border-zinc-800 dark:bg-zinc-900/10">
      <div className="mb-3 px-4 flex items-center justify-between">
        <h3 className="font-bold text-lg">Recommended Reels</h3>
        <button
          onClick={() => navigate("/r")}
          className="text-sm font-semibold text-violet-600 hover:underline"
        >
          View all
        </button>
      </div>
      <Stories>
        <StoriesContent>
          {displayReels.map((reel) => (
            <Story
              className="aspect-[9/16] w-[150px] sm:w-[180px]"
              key={reel.id}
              onClick={() => navigate(`/r/${reel.id}`)}
            >
              <StoryVideo 
                src={reel.media?.[0]?.url || ""} 
                poster={reel.media?.[0]?.poster || ""}
              />
              <StoryOverlay />
              
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/20 px-2 py-1 backdrop-blur-md">
                <Play size={10} fill="white" className="text-white" />
                <span className="text-[10px] font-bold text-white">
                  {reel.stats?.views || 0}
                </span>
              </div>

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
