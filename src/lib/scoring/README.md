# Scoring (M3)

Centralized NPP Lite logic lives here: domain averages, derived strengths, bands, profile key. Which items are reverse-scored is defined on each row in `src/lib/npp/npp-lite-questions.ts` (`reverseScored` → `NPP_LITE_REVERSE_SCORED_IDS`, used by `npp-lite.ts`).

Do not scatter this business logic across UI components.
