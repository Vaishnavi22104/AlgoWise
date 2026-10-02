import type { Speed } from "./timing";

export interface PlaybackState {
  index: number;
  total: number;
  playing: boolean;
  speed: Speed;
}

export type PlaybackAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "reset" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "toggle" }
  | { type: "tick" }
  | { type: "goto"; index: number }
  | { type: "speed"; speed: Speed }
  | { type: "setTotal"; total: number };

export const initialPlayback = (total: number, speed: Speed = "normal"): PlaybackState => ({
  index: 0,
  total,
  playing: false,
  speed,
});

const clamp = (i: number, total: number) => Math.max(0, Math.min(i, Math.max(total - 1, 0)));

/** Pure reducer so playback behaviour is unit-testable without React. */
export function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  const last = Math.max(state.total - 1, 0);
  switch (action.type) {
    case "next":
      return { ...state, index: clamp(state.index + 1, state.total), playing: false };
    case "prev":
      return { ...state, index: clamp(state.index - 1, state.total), playing: false };
    case "reset":
      return { ...state, index: 0, playing: false };
    case "goto":
      return { ...state, index: clamp(action.index, state.total), playing: false };
    case "play":
      // Pressing play on the final step restarts from the beginning.
      return state.index >= last ? { ...state, index: 0, playing: state.total > 1 } : { ...state, playing: true };
    case "pause":
      return { ...state, playing: false };
    case "toggle":
      return playbackReducer(state, { type: state.playing ? "pause" : "play" });
    case "tick": {
      if (!state.playing) return state;
      const index = clamp(state.index + 1, state.total);
      return { ...state, index, playing: index < last };
    }
    case "speed":
      return { ...state, speed: action.speed };
    case "setTotal":
      return { ...state, total: action.total, index: clamp(state.index, action.total), playing: false };
  }
}
