import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BugInspector } from "../src/components/BugInspector";
import { BugReport } from "../src/types";

describe("BugInspector Component", () => {
  it("renders clean state when zero bugs are detected", () => {
    render(<BugInspector bugs={[]} />);
    expect(screen.getByText("Zero Bugs Detected")).toBeInTheDocument();
    expect(screen.getByText(/AI Bug Oracle verified/i)).toBeInTheDocument();
  });

  it("renders bug title, severity, category, and reproduction steps", () => {
    const mockBugs: BugReport[] = [
      {
        id: "bug-101",
        testRunId: "run-1",
        severity: "critical",
        category: "crash",
        title: "SIGSEGV on checkout tap",
        description: "Application terminated with EXC_CRASH (SIGSEGV).",
        reproSteps: [
          { step: 1, action: "Tap Cart" },
          { step: 2, action: "Tap Checkout", target: "btn_checkout" },
        ],
        stackTrace: "Thread 0 Crashed:\n0x18092837 in main()",
        reproducibility: "deterministic",
        status: "open",
        createdAt: new Date().toISOString(),
      },
    ];

    render(<BugInspector bugs={mockBugs} />);

    expect(screen.getByText("Discovered Bug Findings (1)")).toBeInTheDocument();
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
    expect(screen.getByText("CRASH")).toBeInTheDocument();
    expect(screen.getByText("SIGSEGV on checkout tap")).toBeInTheDocument();
    expect(screen.getByText("Tap Cart")).toBeInTheDocument();
    expect(screen.getByText("Tap Checkout")).toBeInTheDocument();
    expect(screen.getByText(/Thread 0 Crashed/i)).toBeInTheDocument();
  });
});
