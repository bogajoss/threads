import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

interface VideoControls {
  play: () => void;
  pause: () => void;
}

interface RegistryEntry extends VideoControls {
  ratio: number;
}

interface VideoPlaybackContextType {
  reportVisibility: (
    id: string,
    ratio: number,
    controls: VideoControls,
  ) => void;
  unregister: (id: string) => void;
  activeVideoId: string | null;
}

const VideoPlaybackContext = createContext<
  VideoPlaybackContextType | undefined
>(undefined);

interface VideoPlaybackProviderProps {
  children: ReactNode;
}

export const VideoPlaybackProvider: React.FC<VideoPlaybackProviderProps> = ({
  children,
}) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const registryResults = useRef(new Map<string, RegistryEntry>()); // Map<id, { ratio: number, play: fn, pause: fn }>

  // Called by VideoPlayer when its visibility changes
  const reportVisibility = useCallback(
    (id: string, ratio: number, controls: VideoControls) => {
      // Update registry
      if (ratio === 0) {
        if (registryResults.current.has(id)) {
          // If it was the active one, and now hidden, we might need to find a new one or just stop
          registryResults.current.delete(id);
        }
      } else {
        registryResults.current.set(id, { ratio, ...controls });
      }

      // Determine who should be playing
      let bestCandidateId: string | null = null;
      let maxRatio = 0.5; // Minimum visible threshold to auto-play

      for (const [key, value] of registryResults.current.entries()) {
        if (value.ratio > maxRatio) {
          maxRatio = value.ratio;
          bestCandidateId = key;
        }
      }

      if (bestCandidateId !== activeVideoId) {
        setActiveVideoId(bestCandidateId);
      }
    },
    [activeVideoId],
  );

  // Effect to actually enforce play/pause based on activeVideoId
  useEffect(() => {
    registryResults.current.forEach((controls, id) => {
      if (id === activeVideoId) {
        controls.play();
      } else {
        controls.pause();
      }
    });
  }, [activeVideoId]);

  // Cleanup when unmounting a video
  const unregister = useCallback(
    (id: string) => {
      registryResults.current.delete(id);
      if (activeVideoId === id) {
        setActiveVideoId(null);
      }
    },
    [activeVideoId],
  );

  return (
    <VideoPlaybackContext.Provider
      value={{ reportVisibility, unregister, activeVideoId }}
    >
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = (): VideoPlaybackContextType => {
  const context = useContext(VideoPlaybackContext);
  if (!context) {
    throw new Error(
      "useVideoPlayback must be used within a VideoPlaybackProvider",
    );
  }
  return context;
};
