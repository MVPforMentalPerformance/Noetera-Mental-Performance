import type { NppLiteDerivedKey, NppLiteDomainKey, NppLiteProfileKey, NppLiteScoringResult } from "@/lib/scoring/npp-lite";

export const PROFILE_COPY: Record<
  NppLiteProfileKey,
  { title: string; paragraph: string }
> = {
  under_pressure: {
    title: "Under Pressure",
    paragraph:
      "Stabilising Foundation — pressure is currently disrupting your baseline. Your next edge is creating steadier routines and recovery so performance feels more controllable.",
  },
  grounded_performer: {
    title: "Grounded Performer",
    paragraph:
      "Building Consistency — you have a workable base, but it’s not fully reliable yet. Your next edge is tightening the small habits that keep you steady when the week gets messy.",
  },
  capable_performer: {
    title: "Capable Performer",
    paragraph:
      "Refining Performance — your fundamentals are strong and you can deliver. Your next edge is sharpening what’s inconsistent so your best state shows up more often.",
  },
  high_performance_state: {
    title: "High-Performance State",
    paragraph:
      "Sharpening Edge — you can access a strong state under pressure. Your next edge is making it repeatable: less friction, faster resets, and cleaner execution when it counts.",
  },
  elite_performance_state: {
    title: "Elite Performance State",
    paragraph:
      "Sustaining Mastery — you’re operating at a high level with consistency. Your next edge is protecting this standard: recovery, precision, and calm confidence under load.",
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

