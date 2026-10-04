export interface Session {
  id: string;
  appName: string;
  platform: "ios" | "android";
  deviceId: string;
  status: "running" | "completed" | "failed" | "aborted";
  metadata?: {
    deviceName?: string;
    osVersion?: string;
    screenWidth?: number;
    screenHeight?: number;
    [key: string]: unknown;
  };
  startedAt: string;
  endedAt?: string;
}

export interface TestRun {
  id: string;
  sessionId: string;
  name: string;
  status: "pending" | "running" | "passed" | "failed" | "crashed" | "stopped";
  failureReason?: string;
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  stepsCount: number;
  bugsFoundCount: number;
  evidenceManifestKey?: string;
}

export interface ExecutionStep {
  id: string;
  testRunId: string;
  stepIndex: number;
  actionType: string;
  actionPayload?: {
    x?: number;
    y?: number;
    text?: string;
    direction?: string;
    description?: string;
    [key: string]: unknown;
  };
  status: "pending" | "executed" | "failed" | "skipped";
  timestampMs: number;
  videoOffsetMs: number;
  screenshotKey?: string;
  thumbnailKey?: string;
  domTreeSummary?: {
    totalElements?: number;
    interactiveCount?: number;
    screenSignature?: string;
    [key: string]: unknown;
  };
  errorDetails?: string;
}

export interface BugReport {
  id: string;
  testRunId: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "crash" | "anr" | "assertion_failure" | "visual_glitch" | "navigation_lock" | "network_error";
  title: string;
  description: string;
  reproSteps: Array<{ step: number; action: string; target?: string }>;
  stackTrace?: string;
  reproducibility: "deterministic" | "flaky" | "unverified";
  status: "open" | "investigating" | "resolved" | "ignored";
  createdAt: string;
}

export interface FullExecutionTrace {
  testRun: TestRun;
  session: Session | null;
  steps: ExecutionStep[];
  bugs: BugReport[];
  latencyMs: number;
}

export interface DiscoveredDevice {
  id: string;
  name: string;
  platform: "ios" | "android";
  state: "booted" | "shutdown" | "offline";
}
