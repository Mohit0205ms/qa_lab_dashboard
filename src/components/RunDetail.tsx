import React, { useState } from "react";
import type { FullExecutionTrace } from "../types";
import { TimelineScrubber } from "./TimelineScrubber";
import { BugInspector } from "./BugInspector";
import { ArrowLeft, Clock, Smartphone, Layers, Bug, Zap } from "lucide-react";

interface RunDetailProps {
  trace: FullExecutionTrace;
  onBack: () => void;
}

export const RunDetail: React.FC<RunDetailProps> = ({ trace, onBack }) => {
  const [selectedTab, setSelectedTab] = useState<"timeline" | "bugs">("timeline");
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const { testRun, session, steps, bugs, latencyMs } = trace;
  const durationSec = testRun.durationMs ? (testRun.durationMs / 1000).toFixed(2) : "0.00";

  return (
    <div className="run-detail-container">
      {/* Top Navigation & Info Header */}
      <div className="detail-top-nav">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Runs</span>
        </button>

        <div className="query-latency-pill">
          <Zap size={14} />
          <span>SQLite Query: <strong>{latencyMs}ms</strong> (SLA &lt;50ms)</span>
        </div>
      </div>

      <div className="detail-meta-card">
        <div className="meta-left">
          <div className="meta-badges">
            <span className={`status-badge ${testRun.status}`}>{testRun.status.toUpperCase()}</span>
            <span className="platform-badge">{session?.platform.toUpperCase() || "IOS"}</span>
            <span className="run-id-pill">{testRun.id}</span>
          </div>
          <h2 className="detail-title">{testRun.name}</h2>
          <p className="detail-app-name">App: <strong>{session?.appName || "com.apple.Preferences"}</strong></p>
        </div>

        <div className="meta-stats-grid">
          <div className="meta-stat">
            <Clock size={16} />
            <div>
              <span className="stat-val">{durationSec}s</span>
              <span className="stat-label">Duration</span>
            </div>
          </div>

          <div className="meta-stat">
            <Layers size={16} />
            <div>
              <span className="stat-val">{steps.length}</span>
              <span className="stat-label">Steps</span>
            </div>
          </div>

          <div className="meta-stat">
            <Bug size={16} />
            <div>
              <span className="stat-val">{bugs.length}</span>
              <span className="stat-label">Bugs</span>
            </div>
          </div>

          <div className="meta-stat">
            <Smartphone size={16} />
            <div>
              <span className="stat-val">{session?.deviceId ? session.deviceId.substring(0, 8) : "local"}</span>
              <span className="stat-label">Device</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button
          className={`tab-btn ${selectedTab === "timeline" ? "active" : ""}`}
          onClick={() => setSelectedTab("timeline")}
        >
          <Layers size={16} />
          <span>Execution Timeline ({steps.length} steps)</span>
        </button>

        <button
          className={`tab-btn ${selectedTab === "bugs" ? "active" : ""}`}
          onClick={() => setSelectedTab("bugs")}
        >
          <Bug size={16} />
          <span>Bug Findings ({bugs.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="detail-tab-content">
        {selectedTab === "timeline" ? (
          <TimelineScrubber
            steps={steps}
            selectedStepIndex={selectedStepIndex}
            onSelectStep={setSelectedStepIndex}
          />
        ) : (
          <BugInspector bugs={bugs} />
        )}
      </div>
    </div>
  );
};
