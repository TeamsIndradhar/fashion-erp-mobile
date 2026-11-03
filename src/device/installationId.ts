import * as Crypto from "expo-crypto";
import type { SecureKV } from "../auth/tokenStore";

const KEY = "fe.installationId.v1";

/** App-generated UUID per install, no hardware ids (D-024). Kept in SecureStore with the tokens. */
export async function getInstallationId(kv: SecureKV, newUuid: () => string = Crypto.randomUUID): Promise<string> {
  const existing = await kv.getItem(KEY);
  if (existing) return existing;
  const id = newUuid();
  await kv.setItem(KEY, id);
  return id;
}
