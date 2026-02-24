// Global lock to ensure only one video plays at a time across components
let currentlyPlayingPlayer: any = null;

export const setCurrentlyPlayingPlayer = (player: any) => {
  currentlyPlayingPlayer = player;
};

export const getCurrentlyPlayingPlayer = () => {
  return currentlyPlayingPlayer;
};

export const resetCurrentlyPlayingPlayer = () => {
  currentlyPlayingPlayer = null;
};
