import { describe, expect, it } from "vitest";
import { initialPlayback, playbackReducer } from "@/core/visualization/playback";

describe("playback reducer", () => {
  const start = initialPlayback(4);

  it("steps forward and back within bounds", () => {
    let s = playbackReducer(start, { type: "prev" });
    expect(s.index).toBe(0);
    s = playbackReducer(s, { type: "next" });
    expect(s.index).toBe(1);
    for (let i = 0; i < 10; i++) s = playbackReducer(s, { type: "next" });
    expect(s.index).toBe(3);
  });

  it("plays, ticks, and stops on the last step", () => {
    let s = playbackReducer(start, { type: "play" });
    expect(s.playing).toBe(true);
    s = playbackReducer(s, { type: "tick" });
    s = playbackReducer(s, { type: "tick" });
    s = playbackReducer(s, { type: "tick" });
    expect(s.index).toBe(3);
    expect(s.playing).toBe(false);
  });

  it("restarts when play is pressed on the last step", () => {
    const end = { ...start, index: 3 };
    const s = playbackReducer(end, { type: "play" });
    expect(s.index).toBe(0);
    expect(s.playing).toBe(true);
  });

  it("pauses on manual stepping and resets", () => {
    let s = playbackReducer(start, { type: "play" });
    s = playbackReducer(s, { type: "next" });
    expect(s.playing).toBe(false);
    s = playbackReducer(s, { type: "reset" });
    expect(s.index).toBe(0);
  });

  it("clamps goto and updates speed", () => {
    expect(playbackReducer(start, { type: "goto", index: 99 }).index).toBe(3);
    expect(playbackReducer(start, { type: "speed", speed: "fast" }).speed).toBe("fast");
  });
});
