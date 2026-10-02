"use client";

import { useEffect, useReducer } from "react";
import { initialPlayback, playbackReducer } from "./playback";
import { stepIntervalMs } from "./timing";

export function usePlayback(total: number) {
  const [state, dispatch] = useReducer(playbackReducer, total, (t) => initialPlayback(t));

  useEffect(() => {
    dispatch({ type: "setTotal", total });
  }, [total]);

  useEffect(() => {
    if (!state.playing) return;
    const id = setInterval(() => dispatch({ type: "tick" }), stepIntervalMs[state.speed]);
    return () => clearInterval(id);
  }, [state.playing, state.speed]);

  return { state, dispatch };
}
