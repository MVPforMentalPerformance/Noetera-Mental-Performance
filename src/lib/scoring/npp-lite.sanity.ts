import { computeGlobalAverage, pickGlobalProfileKey, pickWeakestDomainKey } from "@/lib/scoring/npp-lite";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`NPP sanity failed: ${msg}`);
}

/**
 * Lightweight, non-runtime sanity checks for the NPP scoring model.
 *
 * This file is intentionally NOT imported by the app; it exists so we can quickly
 * validate threshold behavior and tie-breaking during development.
 */
export function runNppLiteSanityChecks() {
  const all3Domains = {
    focus_attention: { value: 3.0 },
    thought_control: { value: 3.0 },
    emotional_regulation: { value: 3.0 },
    action_consistency: { value: 3.0 },
    performance_state: { value: 3.0 },
  } as const;

  const avg3 = computeGlobalAverage(all3Domains);
  assert(avg3 === 3.0, "global average for all-3 domains should be 3.0");
  assert(pickGlobalProfileKey(avg3) === "grounded_performer", "3.0 should map to grounded_performer");

  const tieWeakest = {
    focus_attention: { value: 3.1 },
    thought_control: { value: 3.1 },
    emotional_regulation: { value: 3.1 },
    action_consistency: { value: 3.1 },
    performance_state: { value: 3.1 },
  } as const;
  assert(
    pickWeakestDomainKey(tieWeakest) === "performance_state",
    "tie weakest-domain must be deterministic (performance_state wins tie-break)",
  );

  assert(pickGlobalProfileKey(1.0) === "under_pressure", "1.0 should map to under_pressure");
  assert(pickGlobalProfileKey(2.7) === "under_pressure", "2.7 should map to under_pressure");
  assert(pickGlobalProfileKey(2.71) === "grounded_performer", "2.71 should map to grounded_performer");
  assert(pickGlobalProfileKey(3.6) === "grounded_performer", "3.6 should map to grounded_performer");
  assert(pickGlobalProfileKey(3.7) === "capable_performer", "3.7 should map to capable_performer");
  assert(pickGlobalProfileKey(4.3) === "capable_performer", "4.3 should map to capable_performer");
  assert(pickGlobalProfileKey(4.4) === "high_performance_state", "4.4 should map to high_performance_state");
  assert(pickGlobalProfileKey(4.7) === "high_performance_state", "4.7 should map to high_performance_state");
  assert(pickGlobalProfileKey(4.8) === "elite_performance_state", "4.8 should map to elite_performance_state");
  assert(pickGlobalProfileKey(5.0) === "elite_performance_state", "5.0 should map to elite_performance_state");
}

