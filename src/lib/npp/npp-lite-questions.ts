export type NppLiteQuestionDomain =
  | "Focus & Attention"
  | "Thought Control"
  | "Emotional Regulation"
  | "Action & Consistency"
  | "Performance State";

export type NppLiteQuestionDefinition = {
  id: number;
  domain: NppLiteQuestionDomain;
  text: string;
  /** Raw 1–5 is inverted (6 − v) so that “higher = better” matches positively worded scale anchors. */
  reverseScored: boolean;
};

export const NPP_LITE_QUESTIONS: readonly NppLiteQuestionDefinition[] = [
  {
    id: 1,
    domain: "Focus & Attention",
    text: "I can keep my attention on what matters, even when things feel noisy.",
    reverseScored: false,
  },
  {
    id: 2,
    domain: "Focus & Attention",
    text: "My focus is easily pulled away by distractions.",
    reverseScored: true,
  },
  {
    id: 3,
    domain: "Thought Control",
    text: "I can notice unhelpful thoughts and return to the task.",
    reverseScored: false,
  },
  {
    id: 4,
    domain: "Thought Control",
    text: "My thoughts tend to spiral and take over my performance.",
    reverseScored: true,
  },
  {
    id: 5,
    domain: "Emotional Regulation",
    text: "I can stay steady when pressure rises.",
    reverseScored: false,
  },
  {
    id: 6,
    domain: "Emotional Regulation",
    text: "My emotions make it hard to respond the way I want.",
    reverseScored: true,
  },
  {
    id: 7,
    domain: "Action & Consistency",
    text: "I follow through on the habits I set for myself.",
    reverseScored: false,
  },
  {
    id: 8,
    domain: "Action & Consistency",
    text: "I struggle to stay consistent once my routine is disrupted.",
    reverseScored: true,
  },
  {
    id: 9,
    domain: "Performance State",
    text: "I can access a calm, confident performance state when it counts.",
    reverseScored: false,
  },
  {
    id: 10,
    domain: "Performance State",
    text: "I doubt myself in key moments.",
    reverseScored: true,
  },
];

export const NPP_LITE_REVERSE_SCORED_IDS = new Set(
  NPP_LITE_QUESTIONS.filter((q) => q.reverseScored).map((q) => q.id),
);

function assertNppLiteQuestionnaireInvariants(qs: readonly NppLiteQuestionDefinition[]) {
  if (qs.length !== 10) {
    throw new Error("NPP Lite: expected exactly 10 questions.");
  }
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i]!;
    if (q.id !== i + 1) {
      throw new Error(`NPP Lite: question at index ${i} must have id ${i + 1}, got ${q.id}.`);
    }
  }
  const reversed = qs.filter((q) => q.reverseScored);
  if (reversed.length !== 5) {
    throw new Error("NPP Lite: expected exactly 5 reverse-scored items (one per domain).");
  }
  for (let d = 0; d < 5; d++) {
    const first = qs[d * 2]!;
    const second = qs[d * 2 + 1]!;
    if (first.reverseScored === second.reverseScored) {
      throw new Error(
        `NPP Lite: domain slot ${d} must have one reverse-scored and one standard item (ids ${first.id}, ${second.id}).`,
      );
    }
  }
}

assertNppLiteQuestionnaireInvariants(NPP_LITE_QUESTIONS);
