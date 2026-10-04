import React from "react";
import { Activity, Smartphone, RefreshCw, Zap } from "lucide-react";

interface HeaderProps {
  isBackendConnected: boolean;
  bootedDevicesCount: number;
  onRefresh: () => void;
  onSeedDemo: () => void;
  isSeeding: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isBackendConnected,
  bootedDevicesCount,
  onRefresh,
  onSeedDemo,
  isSeeding,
}) => {
  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <div className="logo-badge">
          <Activity className="logo-icon" size={24} />
        </div>
        <div>
          <h1 className="header-title">QA Device Lab</h1>
          <p className="header-subtitle">Autonomous Mobile QA Agent & Timeline Inspector</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="status-pill">
          <span className={`status-dot ${isBackendConnected ? "online" : "offline"}`} />
          <span className="status-text">
            {isBackendConnected ? "API Connected (:3001)" : "Connecting API..."}
          </span>
        </div>

        <div className="device-pill">
          <Smartphone size={16} />
          <span>{bootedDevicesCount} Booted Device{bootedDevicesCount === 1 ? "" : "s"}</span>
        </div>

        <button className="btn-secondary" onClick={onRefresh} title="Refresh data">
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>

        <button
          className="btn-primary"
          onClick={onSeedDemo}
          disabled={isSeeding || !isBackendConnected}
          title="Seed demo run into SQLite datastore"
        >
          <Zap size={15} />
          <span>{isSeeding ? "Seeding..." : "Seed Demo Run"}</span>
        </button>
      </div>
    </header>
  );
};
