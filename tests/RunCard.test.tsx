import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RunCard } from "../src/components/RunCard";
import { TestRun } from "../src/types";

describe("RunCard Component", () => {
  const mockRun: TestRun = {
    id: "run-test-1",
    sessionId: "sess-1",
    name: "Autonomous Login Flow",
    status: "passed",
    startedAt: new Date().toISOString(),
    durationMs: 3450,
    stepsCount: 5,
    bugsFoundCount: 0,
  };

  it("renders run details, status badge, and duration accurately", () => {
    const onSelect = vi.fn();
    render(<RunCard run={mockRun} onSelect={onSelect} />);

    expect(screen.getByText("Autonomous Login Flow")).toBeInTheDocument();
    expect(screen.getByText("run-test-1")).toBeInTheDocument();
    expect(screen.getByText("PASSED")).toBeInTheDocument();
    expect(screen.getByText("3.45s")).toBeInTheDocument();
    expect(screen.getByText("5 steps")).toBeInTheDocument();
    expect(screen.getByText("0 bugs")).toBeInTheDocument();
  });

  it("triggers onSelect callback when clicked", () => {
    const onSelect = vi.fn();
    render(<RunCard run={mockRun} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Autonomous Login Flow"));
    expect(onSelect).toHaveBeenCalledWith("run-test-1");
  });

  it("renders failure reasons and highlighted bug counts when present", () => {
    const failedRun: TestRun = {
      ...mockRun,
      id: "run-failed-2",
      status: "failed",
      failureReason: "Assertion failed: Submit button disabled",
      bugsFoundCount: 2,
    };

    render(<RunCard run={failedRun} onSelect={vi.fn()} />);

    expect(screen.getByText("FAILED")).toBeInTheDocument();
    expect(screen.getByText(/Submit button disabled/i)).toBeInTheDocument();
    expect(screen.getByText("2 bugs")).toBeInTheDocument();
  });
});
