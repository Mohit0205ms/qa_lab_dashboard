import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimelineScrubber } from "../src/components/TimelineScrubber";
import { ExecutionStep } from "../src/types";

describe("TimelineScrubber Component", () => {
  const mockSteps: ExecutionStep[] = [
    {
      id: "step-0",
      testRunId: "run-1",
      stepIndex: 0,
      actionType: "tap",
      actionPayload: { x: 150, y: 250, description: "Tap Continue" },
      status: "executed",
      timestampMs: 200,
      videoOffsetMs: 200,
      screenshotKey: "run-1/screenshots/step_1.webp",
    },
    {
      id: "step-1",
      testRunId: "run-1",
      stepIndex: 1,
      actionType: "type",
      actionPayload: { text: "user@example.com", description: "Enter email" },
      status: "executed",
      timestampMs: 800,
      videoOffsetMs: 800,
      screenshotKey: "run-1/screenshots/step_2.webp",
    },
  ];

  it("renders step counter, timestamp offset, and payload details", () => {
    render(
      <TimelineScrubber
        steps={mockSteps}
        selectedStepIndex={0}
        onSelectStep={vi.fn()}
      />
    );

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("of 2")).toBeInTheDocument();
    expect(screen.getAllByText("+200ms").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Tap Continue")).toBeInTheDocument();
    expect(screen.getByText("X: 150, Y: 250")).toBeInTheDocument();
  });

  it("calls onSelectStep when clicking next step button", () => {
    const onSelectStep = vi.fn();
    render(
      <TimelineScrubber
        steps={mockSteps}
        selectedStepIndex={0}
        onSelectStep={onSelectStep}
      />
    );

    const nextBtn = screen.getByTitle("Next step");
    fireEvent.click(nextBtn);
    expect(onSelectStep).toHaveBeenCalledWith(1);
  });
});
