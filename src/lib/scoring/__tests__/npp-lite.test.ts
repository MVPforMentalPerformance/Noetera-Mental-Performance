import { describe, it, expect } from "vitest";
import {
  computeGlobalAverage,
  pickGlobalProfileKey,
  pickWeakestDomainKey,
  scoreNppLite,
  type NppLiteDomainKey,
} from "@/lib/scoring/npp-lite";

const ALL_DOMAINS = (v: number): Record<NppLiteDomainKey, { value: number }> => ({
  focus_attention: { value: v },
  thought_control: { value: v },
  emotional_regulation: { value: v },
  action_consistency: { value: v },
  performance_state: { value: v },
});

describe("computeGlobalAverage", () => {
  it("returns the mean of 5 equal domain values", () => {
    expect(computeGlobalAverage(ALL_DOMAINS(3.0))).toBe(3.0);
    expect(computeGlobalAverage(ALL_DOMAINS(5.0))).toBe(5.0);
    expect(computeGlobalAverage(ALL_DOMAINS(1.0))).toBe(1.0);
  });

  it("returns the correct mean for mixed values", () => {
    const domains: Record<NppLiteDomainKey, { value: number }> = {
      focus_attention: { value: 2.0 },
      thought_control: { value: 3.0 },
      emotional_regulation: { value: 4.0 },
      action_consistency: { value: 5.0 },
      performance_state: { value: 1.0 },
    };
    expect(computeGlobalAverage(domains)).toBe(3.0);
  });
});

describe("pickGlobalProfileKey", () => {
  it("maps boundary values to the correct profile tiers", () => {
    expect(pickGlobalProfileKey(1.0)).toBe("under_pressure");
    expect(pickGlobalProfileKey(2.7)).toBe("under_pressure");
    expect(pickGlobalProfileKey(2.71)).toBe("grounded_performer");
    expect(pickGlobalProfileKey(3.0)).toBe("grounded_performer");
    expect(pickGlobalProfileKey(3.6)).toBe("grounded_performer");
    expect(pickGlobalProfileKey(3.7)).toBe("capable_performer");
    expect(pickGlobalProfileKey(4.3)).toBe("capable_performer");
    expect(pickGlobalProfileKey(4.4)).toBe("high_performance_state");
    expect(pickGlobalProfileKey(4.7)).toBe("high_performance_state");
    expect(pickGlobalProfileKey(4.8)).toBe("elite_performance_state");
    expect(pickGlobalProfileKey(5.0)).toBe("elite_performance_state");
  });
});

describe("pickWeakestDomainKey", () => {
  it("returns the domain with the lowest value", () => {
    const domains: Record<NppLiteDomainKey, { value: number }> = {
      focus_attention: { value: 3.5 },
      thought_control: { value: 2.0 },
      emotional_regulation: { value: 4.0 },
      action_consistency: { value: 3.0 },
      performance_state: { value: 3.8 },
    };
    expect(pickWeakestDomainKey(domains)).toBe("thought_control");
  });

  it("breaks ties deterministically — performance_state wins", () => {
    expect(pickWeakestDomainKey(ALL_DOMAINS(3.1))).toBe("performance_state");
  });
});

describe("scoreNppLite", () => {
  it("applies reverse scoring to Q2, Q4, Q6, Q8, Q10", () => {
    // All raw responses = 1; reverse-scored items become 6-1 = 5
    const result = scoreNppLite({ responses: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] });
    // Q1 normal=1, Q2 reversed=5 → focus avg = (1+5)/2 = 3
    expect(result.domain_scores.focus_attention.value).toBe(3.0);
    // Q3 normal=1, Q4 reversed=5 → thought avg = 3
    expect(result.domain_scores.thought_control.value).toBe(3.0);
  });

  it("produces the correct profile key for all-3 responses", () => {
    // All raw=3; Q2,4,6,8,10 reverse: 6-3=3; all domains = (3+3)/2 = 3.0; global = 3.0
    const result = scoreNppLite({ responses: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3] });
    expect(result.profile_key).toBe("grounded_performer");
    expect(result.scoring_version).toBe("3");
  });

  it("produces elite profile for all-5 forward and all-1 reverse responses", () => {
    // Max forward: Q1,3,5,7,9 = 5; reverse: Q2,4,6,8,10 raw=1 → reversed=5; all domains = 5.0
    const responses = [5, 1, 5, 1, 5, 1, 5, 1, 5, 1];
    const result = scoreNppLite({ responses });
    expect(result.profile_key).toBe("elite_performance_state");
    expect(result.domain_scores.focus_attention.value).toBe(5.0);
  });

  it("throws on wrong response count", () => {
    expect(() => scoreNppLite({ responses: [1, 2, 3] })).toThrow("10 responses");
  });

  it("throws on out-of-range response values", () => {
    expect(() =>
      scoreNppLite({ responses: [1, 2, 3, 4, 5, 1, 2, 3, 4, 6] }),
    ).toThrow("Invalid response");
  });

  it("accepts response map (object) format", () => {
    const responses: Record<string, number> = {
      "1": 3, "2": 3, "3": 3, "4": 3, "5": 3,
      "6": 3, "7": 3, "8": 3, "9": 3, "10": 3,
    };
    const result = scoreNppLite({ responses });
    expect(result.profile_key).toBe("grounded_performer");
  });
});
