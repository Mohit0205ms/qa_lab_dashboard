import React, { useState } from "react";
import type { TestRun } from "../types";
import { RunCard } from "./RunCard";
import { Search, Filter, ShieldCheck, Bug, Layers, Clock } from "lucide-react";

interface RunListProps {
  runs: TestRun[];
  onSelectRun: (runId: string) => void;
  isLoading: boolean;
}

export const RunList: React.FC<RunListProps> = ({ runs, onSelectRun, isLoading }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRuns = runs.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      r.id.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalRuns = runs.length;
  const passedRuns = runs.filter((r) => r.status === "passed").length;
  const passRate = totalRuns > 0 ? Math.round((passedRuns / totalRuns) * 100) : 100;
  const totalBugs = runs.reduce((acc, r) => acc + (r.bugsFoundCount || 0), 0);
  const avgDuration =
    totalRuns > 0
      ? (runs.reduce((acc, r) => acc + (r.durationMs || 0), 0) / totalRuns / 1000).toFixed(1)
      : "0.0";

  return (
    <div className="run-list-container">
      {/* Metric Highlights Strip */}
      <div className="metrics-strip">
        <div className="metric-card">
          <div className="metric-icon-box blue">
            <Layers size={20} />
          </div>
          <div>
            <div className="metric-value">{totalRuns}</div>
            <div className="metric-label">Total Test Runs</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box green">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="metric-value">{passRate}%</div>
            <div className="metric-label">Pass Rate</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box red">
            <Bug size={20} />
          </div>
          <div>
            <div className="metric-value">{totalBugs}</div>
            <div className="metric-label">Discovered Bugs</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box purple">
            <Clock size={20} />
          </div>
          <div>
            <div className="metric-value">{avgDuration}s</div>
            <div className="metric-label">Avg Run Duration</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search test runs by ID, name, or failure..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-filters">
          <Filter size={16} className="filter-label-icon" />
          {["all", "passed", "failed", "crashed"].map((filter) => (
            <button
              key={filter}
              className={`filter-pill ${statusFilter === filter ? "active" : ""}`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Runs */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading test runs from SQLite datastore...</p>
        </div>
      ) : filteredRuns.length === 0 ? (
        <div className="empty-state">
          <Layers size={48} className="empty-icon" />
          <h3>No test runs found</h3>
          <p>Click "Seed Demo Run" above or run `qa-runner evidence --demo` in terminal.</p>
        </div>
      ) : (
        <div className="runs-grid">
          {filteredRuns.map((run) => (
            <RunCard key={run.id} run={run} onSelect={onSelectRun} />
          ))}
        </div>
      )}
    </div>
  );
};
