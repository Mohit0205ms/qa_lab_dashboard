import React from "react";
import type { TestRun } from "../types";
import { CheckCircle2, XCircle, AlertTriangle, Clock, Layers, Bug, ChevronRight } from "lucide-react";

interface RunCardProps {
  run: TestRun;
  onSelect: (runId: string) => void;
}

export const RunCard: React.FC<RunCardProps> = ({ run, onSelect }) => {
  const getStatusIcon = (status: TestRun["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="status-icon passed" size={16} />;
      case "failed":
        return <XCircle className="status-icon failed" size={16} />;
      case "crashed":
        return <AlertTriangle className="status-icon crashed" size={16} />;
      default:
        return <Clock className="status-icon running" size={16} />;
    }
  };

  const durationSec = run.durationMs ? (run.durationMs / 1000).toFixed(2) : "0.00";
  const formattedDate = new Date(run.startedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="run-card" onClick={() => onSelect(run.id)}>
      <div className="run-card-header">
        <div className="run-id-badge">
          <span className="run-id">{run.id}</span>
          <span className="run-time">{formattedDate}</span>
        </div>

        <div className={`status-badge ${run.status}`}>
          {getStatusIcon(run.status)}
          <span>{run.status.toUpperCase()}</span>
        </div>
      </div>

      <h3 className="run-name">{run.name}</h3>

      {run.failureReason && (
        <div className="run-failure-snippet">
          <span>⚠️ {run.failureReason}</span>
        </div>
      )}

      <div className="run-card-footer">
        <div className="run-metrics">
          <div className="metric-item">
            <Clock size={14} />
            <span>{durationSec}s</span>
          </div>

          <div className="metric-item">
            <Layers size={14} />
            <span>{run.stepsCount} steps</span>
          </div>

          <div className={`metric-item bug-metric ${run.bugsFoundCount > 0 ? "has-bugs" : ""}`}>
            <Bug size={14} />
            <span>{run.bugsFoundCount} {run.bugsFoundCount === 1 ? "bug" : "bugs"}</span>
          </div>
        </div>

        <button className="btn-icon" title="View execution timeline">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
