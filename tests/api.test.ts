import { describe, it, expect, vi } from "vitest";
import { getArtifactUrl, fetchHealth } from "../src/services/api";

describe("API Service (Week 12 Frontend)", () => {
  it("resolves relative artifact keys to backend static URL", () => {
    const url = getArtifactUrl("run-123/screenshots/step_1.webp");
    expect(url).toContain("/api/artifacts/run-123/screenshots/step_1.webp");
  });

  it("preserves absolute HTTP/HTTPS URLs untouched", () => {
    const absUrl = "https://s3.amazonaws.com/bucket/screenshot.webp";
    expect(getArtifactUrl(absUrl)).toBe(absUrl);
  });

  it("handles empty artifact keys gracefully", () => {
    expect(getArtifactUrl(undefined)).toBe("");
    expect(getArtifactUrl("")).toBe("");
  });

  it("throws descriptive error when server is unreachable", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(fetchHealth()).rejects.toThrow("Failed to fetch health: Internal Server Error");
  });
});
