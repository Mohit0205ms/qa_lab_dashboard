import React, { useState, useEffect } from "react";
import type { ExecutionStep } from "../types";
import { getArtifactUrl } from "../services/api";
import { Play, Pause, ChevronLeft, ChevronRight, Crosshair, Clock, Layers } from "lucide-react";

interface TimelineScrubberProps {
  steps: ExecutionStep[];
  selectedStepIndex: number;
  onSelectStep: (index: number) => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  steps,
  selectedStepIndex,
  onSelectStep,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = steps[selectedStepIndex] || steps[0];

  // Auto-play scrubber animation
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && steps.length > 1) {
      timer = setInterval(() => {
        onSelectStep((selectedStepIndex + 1) % steps.length);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedStepIndex, steps.length, onSelectStep]);

  if (!steps || steps.length === 0) {
    return (
      <div className="empty-timeline">
        <Layers size={36} />
        <p>No execution steps recorded for this test run.</p>
      </div>
    );
  }

  const payload = currentStep?.actionPayload || {};
  const hasCoordinates = typeof payload.x === "number" && typeof payload.y === "number";

  return (
    <div className="timeline-container">
      {/* Top Scrubber Control Bar */}
      <div className="scrubber-header">
        <div className="step-counter">
          <span className="step-num">Step {selectedStepIndex + 1}</span>
          <span className="step-total">of {steps.length}</span>
        </div>

        <div className="playback-controls">
          <button
            className="ctrl-btn"
            disabled={selectedStepIndex <= 0}
            onClick={() => onSelectStep(Math.max(0, selectedStepIndex - 1))}
            title="Previous step"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            className="ctrl-btn play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause timeline replay" : "Play timeline replay"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            className="ctrl-btn"
            disabled={selectedStepIndex >= steps.length - 1}
            onClick={() => onSelectStep(Math.min(steps.length - 1, selectedStepIndex + 1))}
            title="Next step"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="step-timestamp">
          <Clock size={14} />
          <span>+{currentStep.timestampMs}ms</span>
        </div>
      </div>

      {/* Visual Timeline Track with Clickable Markers */}
      <div className="timeline-track-wrapper">
        <div className="timeline-track">
          <div
            className="timeline-progress"
            style={{
              width: `${(selectedStepIndex / Math.max(1, steps.length - 1)) * 100}%`,
            }}
          />
          {steps.map((step, idx) => (
            <button
              key={step.id}
              className={`timeline-node ${idx === selectedStepIndex ? "active" : ""} ${
                idx < selectedStepIndex ? "completed" : ""
              }`}
              onClick={() => onSelectStep(idx)}
              style={{
                left: `${(idx / Math.max(1, steps.length - 1)) * 100}%`,
              }}
              title={`Step ${idx + 1}: ${step.actionType}`}
            >
              <span className="node-dot" />
              <span className="node-tooltip">{step.actionType.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Detail Card + Screen Preview */}
      <div className="step-viewport-grid">
        {/* Device Screen Preview with Tap Target Overlay */}
        <div className="screen-preview-container">
          <div className="device-frame">
            {currentStep.screenshotKey ? (
              <div className="screenshot-wrapper">
                <img
                  src={getArtifactUrl(currentStep.screenshotKey)}
                  alt={`Step ${selectedStepIndex + 1}`}
                  className="device-screenshot"
                />
                {/* Interactive Target Crosshair Overlay */}
                {hasCoordinates && (
                  <div
                    className="tap-crosshair"
                    style={{
                      left: `${Math.min(95, Math.max(5, (payload.x! / 400) * 100))}%`,
                      top: `${Math.min(95, Math.max(5, (payload.y! / 800) * 100))}%`,
                    }}
                  >
                    <div className="crosshair-ripple" />
                    <Crosshair size={22} className="crosshair-icon" />
                    <span className="crosshair-label">({payload.x}, {payload.y})</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="screenshot-placeholder">
                <p>Screenshot not captured for this step</p>
              </div>
            )}
          </div>
        </div>

        {/* Step Inspector Panel */}
        <div className="step-inspector">
          <div className="inspector-card">
            <div className="inspector-header">
              <span className="action-tag">{currentStep.actionType.toUpperCase()}</span>
              <span className="status-tag success">{currentStep.status.toUpperCase()}</span>
            </div>

            <h4 className="action-title">
              {payload.description || `Execute ${currentStep.actionType} action`}
            </h4>

            <div className="payload-table">
              <div className="payload-row">
                <span className="key">Action Type</span>
                <span className="val">{currentStep.actionType}</span>
              </div>
              {payload.x !== undefined && (
                <div className="payload-row">
                  <span className="key">Coordinates</span>
                  <span className="val">X: {payload.x}, Y: {payload.y}</span>
                </div>
              )}
              {payload.text && (
                <div className="payload-row">
                  <span className="key">Input Text</span>
                  <span className="val highlight">"{payload.text}"</span>
                </div>
              )}
              {payload.direction && (
                <div className="payload-row">
                  <span className="key">Direction</span>
                  <span className="val">{payload.direction}</span>
                </div>
              )}
              <div className="payload-row">
                <span className="key">Timeline Offset</span>
                <span className="val">+{currentStep.timestampMs}ms</span>
              </div>
            </div>

            {currentStep.domTreeSummary && (
              <div className="dom-summary-box">
                <h5>DOM Accessibility Snapshot</h5>
                <div className="dom-metrics">
                  <span>Total Elements: {currentStep.domTreeSummary.totalElements || "N/A"}</span>
                  <span>Interactive: {currentStep.domTreeSummary.interactiveCount || "N/A"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
