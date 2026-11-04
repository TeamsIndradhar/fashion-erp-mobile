import type { AppNotification } from "../../api/types";

/**
 * Where a notification opens in the app (EMP-021). Release 1 has only the
 * attendance screens; everything else is opened in the web ERP.
 */
export function notificationTarget(n: Pick<AppNotification, "relatedModule">): "/attendance" | null {
  return n.relatedModule === "ATTENDANCE_CORRECTION" ? "/attendance" : null;
}

export function unreadCount(list: Pick<AppNotification, "isRead">[] | undefined): number {
  return list?.filter((n) => !n.isRead).length ?? 0;
}
