export type DayMeta = {
  title: string;
  blurb: string;
  reflection: string[];
};

export const DAY_META: Record<1 | 2 | 3 | 4 | 5, DayMeta> = {
  1: {
    title: "Stabilize",
    blurb: "A short reset to settle attention and create a calmer baseline.",
    reflection: ["I feel calmer", "I feel steady", "I need more practice"],
  },
  2: {
    title: "Thought detachment",
    blurb: "Notice thoughts without getting pulled into them.",
    reflection: ["More space", "Less noise", "Still distracted"],
  },
  3: {
    title: "Emotional steadiness",
    blurb: "Reduce reactivity and return to center faster.",
    reflection: ["More stable", "Some progress", "Not there yet"],
  },
  4: {
    title: "Consistent action",
    blurb: "Small steps with clarity, even when motivation dips.",
    reflection: ["I took action", "I started", "I postponed"],
  },
  5: {
    title: "Calm performance",
    blurb: "Bring steadiness into pressure and execution.",
    reflection: ["Confident", "Focused", "Overwhelmed"],
  },
};
