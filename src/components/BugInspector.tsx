import React, { useState } from "react";
import type { BugReport } from "../types";
import { Bug, CheckCircle2, Copy, Check, AlertOctagon, Terminal } from "lucide-react";

interface BugInspectorProps {
  bugs: BugReport[];
}

export const BugInspector: React.FC<BugInspectorProps> = ({ bugs }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyStackTrace = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!bugs || bugs.length === 0) {
    return (
      <div className="bug-clean-state">
        <CheckCircle2 size={36} className="clean-icon" />
        <h4>Zero Bugs Detected</h4>
        <p>AI Bug Oracle verified this execution trace with zero crashes or invariant violations.</p>
      </div>
    );
  }

  return (
    <div className="bug-inspector-container">
      <div className="bug-header-strip">
        <Bug size={18} className="bug-strip-icon" />
        <h3>Discovered Bug Findings ({bugs.length})</h3>
      </div>

      <div className="bug-cards-list">
        {bugs.map((b) => (
          <div key={b.id} className={`bug-report-card severity-${b.severity}`}>
            <div className="bug-card-top">
              <div className="bug-badges">
                <span className={`badge-severity ${b.severity}`}>
                  <AlertOctagon size={12} />
                  {b.severity.toUpperCase()}
                </span>
                <span className="badge-category">{b.category.toUpperCase()}</span>
                <span className="badge-repro">{b.reproducibility.toUpperCase()}</span>
              </div>
              <span className="bug-id">{b.id}</span>
            </div>

            <h4 className="bug-title">{b.title}</h4>
            <p className="bug-description">{b.description}</p>

            {/* Repro Steps */}
            {b.reproSteps && b.reproSteps.length > 0 && (
              <div className="repro-steps-box">
                <h5>Deterministic Reproduction Steps</h5>
                <ol className="repro-list">
                  {b.reproSteps.map((step, idx) => (
                    <li key={idx}>
                      <span className="step-num">{step.step || idx + 1}.</span>
                      <span className="step-act">{step.action}</span>
                      {step.target && <span className="step-tgt"> → {step.target}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Stack Trace */}
            {b.stackTrace && (
              <div className="stack-trace-box">
                <div className="stack-header">
                  <div className="stack-title">
                    <Terminal size={14} />
                    <span>Stack Trace / Error Diagnostic</span>
                  </div>
                  <button
                    className="btn-copy"
                    onClick={() => handleCopyStackTrace(b.id, b.stackTrace!)}
                    title="Copy stack trace"
                  >
                    {copiedId === b.id ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedId === b.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="stack-code">{b.stackTrace}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
