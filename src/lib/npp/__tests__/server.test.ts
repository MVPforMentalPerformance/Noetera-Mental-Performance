import { describe, expect, it } from "vitest";
import { buildNppAssessmentComparison, type NppAssessmentResultRow } from "@/lib/npp/server";

function makeResult(
  overrides: Partial<NppAssessmentResultRow> & Pick<NppAssessmentResultRow, "created_at" | "global_average">,
): NppAssessmentResultRow {
  return {
    id: overrides.id ?? overrides.created_at,
    user_id: overrides.user_id ?? "user-1",
    created_at: overrides.created_at,
    responses: overrides.responses ?? {},
    domain_scores: overrides.domain_scores ?? {
      focus_attention: { value: 3.0, band: "developing" },
      thought_control: { value: 3.0, band: "developing" },
      emotional_regulation: { value: 3.0, band: "developing" },
      action_consistency: { value: 3.0, band: "developing" },
      performance_state: { value: 3.0, band: "developing" },
    },
    derived_map: overrides.derived_map ?? {
      mental_toughness: { value: 3.0, band: "developing" },
      flow: { value: 3.0, band: "developing" },
      self_concept: { value: 3.0, band: "developing" },
      life_effectiveness: { value: 3.0, band: "developing" },
    },
    profile_key: overrides.profile_key ?? "grounded_performer",
    scoring_version: overrides.scoring_version ?? "3",
    display_profile_key: overrides.display_profile_key ?? "grounded_performer",
    global_average: overrides.global_average,
    weakest_domain_key: overrides.weakest_domain_key ?? "performance_state",
  };
}

describe("buildNppAssessmentComparison", () => {
  it("returns new_baseline when only one snapshot exists", () => {
    const latest = makeResult({ created_at: "2026-05-10T00:00:00.000Z", global_average: 3.4 });

    expect(buildNppAssessmentComparison([latest])).toEqual({
      latest,
      previous: null,
      trend: "new_baseline",
      global_average_delta: null,
      strongest_gain_domain: null,
      strongest_drop_domain: null,
      priority_domain_key: "performance_state",
    });
  });

  it("detects upward movement and strongest domain gain", () => {
    const latest = makeResult({
      created_at: "2026-05-11T00:00:00.000Z",
      global_average: 3.8,
      weakest_domain_key: "thought_control",
      domain_scores: {
        focus_attention: { value: 3.7, band: "developing" },
        thought_control: { value: 3.1, band: "needs_training" },
        emotional_regulation: { value: 4.0, band: "developing" },
        action_consistency: { value: 4.2, band: "strong" },
        performance_state: { value: 3.9, band: "developing" },
      },
    });
    const previous = makeResult({
      created_at: "2026-05-01T00:00:00.000Z",
      global_average: 3.4,
      weakest_domain_key: "thought_control",
      domain_scores: {
        focus_attention: { value: 3.2, band: "developing" },
        thought_control: { value: 3.0, band: "needs_training" },
        emotional_regulation: { value: 3.8, band: "developing" },
        action_consistency: { value: 3.7, band: "developing" },
        performance_state: { value: 3.3, band: "developing" },
      },
    });

    expect(buildNppAssessmentComparison([latest, previous])).toMatchObject({
      trend: "up",
      global_average_delta: 0.4,
      strongest_gain_domain: { key: "performance_state", delta: 0.6 },
      strongest_drop_domain: null,
      priority_domain_key: "thought_control",
    });
  });

  it("detects downward movement and strongest domain drop", () => {
    const latest = makeResult({
      created_at: "2026-05-11T00:00:00.000Z",
      global_average: 3.1,
      weakest_domain_key: "emotional_regulation",
      domain_scores: {
        focus_attention: { value: 3.4, band: "developing" },
        thought_control: { value: 3.1, band: "needs_training" },
        emotional_regulation: { value: 2.6, band: "needs_training" },
        action_consistency: { value: 3.2, band: "developing" },
        performance_state: { value: 3.2, band: "developing" },
      },
    });
    const previous = makeResult({
      created_at: "2026-05-01T00:00:00.000Z",
      global_average: 3.5,
      weakest_domain_key: "emotional_regulation",
      domain_scores: {
        focus_attention: { value: 3.7, band: "developing" },
        thought_control: { value: 3.4, band: "developing" },
        emotional_regulation: { value: 3.2, band: "developing" },
        action_consistency: { value: 3.5, band: "developing" },
        performance_state: { value: 3.7, band: "developing" },
      },
    });

    expect(buildNppAssessmentComparison([latest, previous])).toMatchObject({
      trend: "down",
      global_average_delta: -0.4,
      strongest_gain_domain: null,
      strongest_drop_domain: { key: "emotional_regulation", delta: -0.6 },
      priority_domain_key: "emotional_regulation",
    });
  });
});
