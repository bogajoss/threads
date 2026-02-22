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
  const registryResults = useRef(new Map<string, RegistryEntry>());

  const reportVisibility = useCallback(
    (id: string, ratio: number, controls: VideoControls) => {
      if (ratio === 0) {
        if (registryResults.current.has(id)) {
          registryResults.current.delete(id);
        }
      } else {
        registryResults.current.set(id, { ratio, ...controls });
      }

      let bestCandidateId: string | null = null;
      let maxRatio = 0.3; // Lowered threshold for better feed experience

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

  useEffect(() => {
    registryResults.current.forEach((controls, id) => {
      if (id === activeVideoId) {
        controls.play();
      } else {
        controls.pause();
      }
    });
  }, [activeVideoId]);

  const unregister = useCallback(
    (id: string) => {
      // Pause the video being unregistered before removing it
      const entry = registryResults.current.get(id);
      if (entry && typeof entry.pause === "function") {
        entry.pause();
      }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useVideoPlayback = (): VideoPlaybackContextType => {
  const context = useContext(VideoPlaybackContext);
  if (!context) {
    throw new Error(
      "useVideoPlayback must be used within a VideoPlaybackProvider",
    );
  }
  return context;
};
