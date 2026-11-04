import { File } from "expo-file-system";
import { Platform } from "react-native";

export interface LocalFile {
  uri: string;
  name: string;
  type: string;
}

/** A FormData file part that Expo's fetch can send. */
export interface FormFilePart {
  name: string;
  type: string;
  bytes(): Promise<Uint8Array>;
}

/** Thrown when a picked / captured file cannot be read from the phone. */
export class LocalFileReadError extends Error {
  constructor(cause: unknown) {
    super(`File could not be read: ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = "LocalFileReadError";
  }
}

function normaliseUri(uri: string): string {
  if (Platform.OS === "android" && !uri.startsWith("file://") && !uri.startsWith("content://")) return `file://${uri}`;
  return uri;
}

/**
 * Expo SDK 58 installs `expo/fetch` as the global fetch. It rejects React
 * Native's `{ uri, name, type }` FormData parts ("Unsupported FormDataPart
 * implementation"); it only takes strings, Blobs or objects with `bytes()`.
 * This part keeps the file name and MIME type and reads the bytes when the
 * request is sent.
 */
export function formFilePart(file: LocalFile, readFile: (uri: string) => Promise<ArrayBuffer> = (uri) => new File(uri).arrayBuffer()): FormFilePart {
  const uri = normaliseUri(file.uri);
  return {
    name: file.name || "file",
    type: file.type || "application/octet-stream",
    async bytes() {
      try {
        return new Uint8Array(await readFile(uri));
      } catch (err) {
        throw new LocalFileReadError(err);
      }
    },
  };
}

/** Appends a local file to a FormData body. */
export function appendFile(form: FormData, field: string, file: LocalFile): void {
  form.append(field, formFilePart(file) as unknown as Blob);
}
