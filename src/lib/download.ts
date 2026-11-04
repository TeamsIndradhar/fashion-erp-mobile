import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { ApiError } from "../api/errors";
import { env } from "../config/env";
import { strings } from "../config/strings";
import { getSession } from "../core/services";

/**
 * Downloads a signed-in file (e.g. a salary slip PDF) to the app cache and
 * opens the phone's viewer / share sheet. Files stay in the cache only.
 */
export async function openAuthedFile(path: string, fileName: string, mimeType: string): Promise<void> {
  const token = await getSession().freshAccessToken();
  if (!token) throw new ApiError(401, "AUTH_TOKEN_INVALID", strings.session.expired);
  const target = new File(Paths.cache, fileName.replace(/[^\w.-]+/g, "_"));
  let file: File;
  try {
    file = await File.downloadFileAsync(`${env.apiBaseUrl}${path}`, target, {
      headers: { Authorization: `Bearer ${token}`, "X-App-Version": env.appVersion, "X-App-Platform": env.platform },
      idempotent: true,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "The file could not be downloaded. Check your connection and try again.");
  }
  if (!(await Sharing.isAvailableAsync())) throw new ApiError(0, "SERVER_ERROR", "This phone cannot open the file.");
  await Sharing.shareAsync(file.uri, { mimeType, UTI: mimeType === "application/pdf" ? "com.adobe.pdf" : undefined });
}
