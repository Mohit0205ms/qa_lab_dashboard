import type { FullExecutionTrace, TestRun, BugReport, DiscoveredDevice } from "../types";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";

export async function fetchHealth(): Promise<{ status: string; service: string; version: string }> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Failed to fetch health: ${res.statusText}`);
  return res.json();
}

export async function fetchRuns(options?: { status?: string; search?: string }): Promise<{ runs: TestRun[]; total: number }> {
  const params = new URLSearchParams();
  if (options?.status && options.status !== "all") params.append("status", options.status);
  if (options?.search) params.append("search", options.search);

  const url = `${API_BASE_URL}/api/runs?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch runs: ${res.statusText}`);
  return res.json();
}

export async function fetchRunTrace(id: string): Promise<FullExecutionTrace> {
  const res = await fetch(`${API_BASE_URL}/api/runs/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch run trace: ${res.statusText}`);
  return res.json();
}

export async function fetchBugs(testRunId?: string): Promise<{ bugs: BugReport[]; total: number }> {
  const url = testRunId
    ? `${API_BASE_URL}/api/bugs?testRunId=${encodeURIComponent(testRunId)}`
    : `${API_BASE_URL}/api/bugs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch bugs: ${res.statusText}`);
  return res.json();
}

export async function fetchDevices(): Promise<{ devices: DiscoveredDevice[]; bootedCount: number; totalCount: number }> {
  const res = await fetch(`${API_BASE_URL}/api/devices`);
  if (!res.ok) throw new Error(`Failed to fetch devices: ${res.statusText}`);
  return res.json();
}

export async function seedDemoRun(): Promise<{ runId: string; trace: FullExecutionTrace }> {
  const res = await fetch(`${API_BASE_URL}/api/runs/demo`, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to seed demo run: ${res.statusText}`);
  return res.json();
}

export function getArtifactUrl(artifactKey?: string): string {
  if (!artifactKey) return "";
  if (artifactKey.startsWith("http://") || artifactKey.startsWith("https://")) return artifactKey;
  // Relative to backend static artifacts
  return `${API_BASE_URL}/api/artifacts/${artifactKey}`;
}
