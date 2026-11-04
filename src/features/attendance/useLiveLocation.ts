import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AttendanceOffice } from "../../api/types";
import { endpoints } from "../../core/services";
import { nearestOffice } from "./estimate";
import { acquireFix, getLocationPermission, locationServicesOn, type GpsFix } from "./location";

export type LiveLocation =
  | { state: "checking"; fix: GpsFix | null }
  | { state: "noPermission" }
  | { state: "servicesOff" }
  | { state: "noFix" }
  | { state: "ready"; fix: GpsFix; office: { office: AttendanceOffice; distance: number; inside: boolean } | null; ageSeconds: number };

const HOME_FIX_TIMEOUT_MS = 12_000;

/**
 * Live "where am I" for the attendance hero (EMP-001/002). Never shows the OS prompt —
 * if location is not granted yet, the punch flow (EMP-003) asks. Display only; the
 * server decides inside/outside on the punch.
 */
export function useLiveLocation(enabled: boolean, targetAccuracy: number) {
  const offices = useQuery({ queryKey: ["attendance", "offices"], queryFn: endpoints.officeLocations, enabled, staleTime: 10 * 60_000 });
  const [status, setStatus] = useState<{ kind: "checking" | "noPermission" | "servicesOff" | "noFix" } | { kind: "fix"; fix: GpsFix }>({ kind: "checking" });
  const [last, setLast] = useState<GpsFix | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const run = useRef(0);

  const refresh = useCallback(() => {
    const id = ++run.current;
    void (async () => {
      const [perm, on] = await Promise.all([getLocationPermission(), locationServicesOn()]);
      if (id !== run.current) return;
      if (perm !== "granted") return setStatus({ kind: "noPermission" });
      if (!on) return setStatus({ kind: "servicesOff" });
      setStatus({ kind: "checking" });
      const fix = await acquireFix(targetAccuracy, HOME_FIX_TIMEOUT_MS, (f) => {
        if (id === run.current) setLast(f);
      });
      if (id !== run.current) return;
      setStatus(fix ? { kind: "fix", fix } : { kind: "noFix" });
    })();
  }, [targetAccuracy]);

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return undefined;
      refresh();
      return () => {
        run.current++;
      };
    }, [enabled, refresh]),
  );

  // "Verified · 12 s ago" keeps counting.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(t);
  }, []);

  let live: LiveLocation;
  if (status.kind === "fix") {
    live = {
      state: "ready",
      fix: status.fix,
      office: offices.data ? nearestOffice(status.fix, offices.data) : null,
      ageSeconds: Math.max(0, Math.round((now - status.fix.timestamp) / 1000)),
    };
  } else if (status.kind === "checking") {
    live = { state: "checking", fix: last };
  } else {
    live = { state: status.kind };
  }
  return { live, refresh };
}

/** "12 s ago" / "3 min ago". */
export function agoText(seconds: number): string {
  if (seconds < 60) return `${seconds} s ago`;
  return `${Math.round(seconds / 60)} min ago`;
}
