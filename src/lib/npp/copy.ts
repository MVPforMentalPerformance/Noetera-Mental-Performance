import type { NppLiteDerivedKey, NppLiteDomainKey, NppLiteScoringResult } from "@/lib/scoring/npp-lite";

export const PROFILE_COPY: Record<
  NppLiteScoringResult["profile_key"],
  { title: string; paragraph: string }
> = {
  aware_but_inconsistent: {
    title: "Aware but Inconsistent",
    paragraph:
      "You know what helps you perform — but follow-through breaks when routines get disrupted. Your next edge is building simple consistency under real life pressure.",
  },
  driven_but_overloaded: {
    title: "Driven but Overloaded",
    paragraph:
      "You can push hard, but mental noise and emotional load can spill into performance. Your next edge is reducing internal friction so effort feels lighter and more controlled.",
  },
  capable_but_distracted: {
    title: "Capable but Distracted",
    paragraph:
      "The skill is there, but attention gets pulled away when things get busy. Your next edge is training steady focus so you can stay with what matters when it counts.",
  },
  underconfident_performer: {
    title: "Underconfident Performer",
    paragraph:
      "You may prepare well, yet self-doubt shows up in key moments. Your next edge is building a calmer performance state you can access on demand.",
  },
};

export const DOMAIN_COPY: Record<NppLiteDomainKey, { label: string; insight: string }> = {
  focus_attention: {
    label: "Focus & Attention",
    insight: "How steady your attention stays when things feel noisy.",
  },
  thought_control: {
    label: "Thought Control",
    insight: "How quickly you can notice unhelpful thoughts and reset.",
  },
  emotional_regulation: {
    label: "Emotional Regulation",
    insight: "How well you stay steady when pressure rises.",
  },
  action_consistency: {
    label: "Action & Consistency",
    insight: "How reliably you follow through when routines change.",
  },
  performance_state: {
    label: "Performance State",
    insight: "How calm and confident you feel when it counts.",
  },
};

export const DERIVED_COPY: Record<NppLiteDerivedKey, { label: string; insight: string }> = {
  mental_toughness: {
    label: "Mental Toughness",
    insight: "Thought + Emotion combined.",
  },
  flow: {
    label: "Flow",
    insight: "Focus + Performance combined.",
  },
  self_concept: {
    label: "Self-Concept",
    insight: "Performance + Action combined.",
  },
  life_effectiveness: {
    label: "Life Effectiveness",
    insight: "Action + Emotion combined.",
  },
};

export function bandLabel(band: NppLiteScoringResult["domain_scores"][NppLiteDomainKey]["band"]) {
  if (band === "strong") return "Strong";
  if (band === "developing") return "Developing";
  return "Needs training";
}

