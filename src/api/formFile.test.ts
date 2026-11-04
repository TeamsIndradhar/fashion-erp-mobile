import { convertFormDataAsync } from "expo/src/winter/fetch/convertFormData";
import { formFilePart, LocalFileReadError } from "./formFile";

jest.mock("expo-file-system", () => ({ File: jest.fn() }));

describe("formFilePart", () => {
  it("is accepted by Expo's fetch FormData encoder, with file name and type", async () => {
    const read = jest.fn().mockResolvedValue(new Uint8Array([65, 66, 67]).buffer);
    // On the phone, Expo patches React Native's FormData to keep object parts as they are (expo/src/winter/FormData.ts).
    const parts: [string, unknown][] = [
      ["type", "IN"],
      ["selfie", formFilePart({ uri: "file:///cache/selfie.jpg", name: "selfie.jpg", type: "image/jpeg" }, read)],
    ];
    const form = { entries: () => parts } as unknown as FormData;
    const { body } = await convertFormDataAsync(form, "----b");
    const text = new TextDecoder().decode(body);
    expect(text).toContain('content-disposition: form-data; name="selfie"; filename="selfie.jpg"');
    expect(text).toContain("content-type: image/jpeg");
    expect(text).toContain("\r\n\r\nABC\r\n");
    expect(read).toHaveBeenCalledWith("file:///cache/selfie.jpg");
  });

  it("wraps a read failure so the app does not call it a network problem", async () => {
    const part = formFilePart({ uri: "file:///gone.jpg", name: "", type: "" }, () => Promise.reject(new Error("missing")));
    expect(part.name).toBe("file");
    expect(part.type).toBe("application/octet-stream");
    await expect(part.bytes()).rejects.toBeInstanceOf(LocalFileReadError);
  });
});
