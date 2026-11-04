import { decisionStatus } from "../features/requests/requests";
import { TONE_COLOR } from "../features/attendance/labels";
import { AppText } from "./AppText";

/** Status as coloured text (never colour alone). */
export function StatusPill({ status }: { status: string }) {
  const s = decisionStatus(status);
  return (
    <AppText variant="micro" color={TONE_COLOR[s.tone]}>
      {s.label.toUpperCase()}
    </AppText>
  );
}
