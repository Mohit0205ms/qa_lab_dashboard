import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { RunList } from "./components/RunList";
import { RunDetail } from "./components/RunDetail";
import type { TestRun, FullExecutionTrace } from "./types";
import { fetchHealth, fetchRuns, fetchRunTrace, fetchDevices, seedDemoRun } from "./services/api";

export function App() {
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<FullExecutionTrace | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [bootedDevicesCount, setBootedDevicesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setErrorMessage(null);
      // 1. Healthcheck
      await fetchHealth();
      setIsBackendConnected(true);

      // 2. Discovered Devices
      const devRes = await fetchDevices();
      setBootedDevicesCount(devRes.bootedCount || 0);

      // 3. Runs
      const runRes = await fetchRuns();
      setRuns(runRes.runs || []);
    } catch {
      setIsBackendConnected(false);
      setErrorMessage("Could not connect to Backend API at http://127.0.0.1:3001. Ensure qa-runner dashboard is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleSelectRun = async (runId: string) => {
    try {
      setIsLoading(true);
      const trace = await fetchRunTrace(runId);
      setSelectedTrace(trace);
    } catch (err: unknown) {
      setErrorMessage(`Failed to load execution trace for ${runId}: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setIsSeeding(true);
      const result = await seedDemoRun();
      await loadData();
      setSelectedTrace(result.trace);
    } catch (err: unknown) {
      setErrorMessage(`Failed to seed demo run: ${(err as Error).message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="dashboard-root">
      <Header
        isBackendConnected={isBackendConnected}
        bootedDevicesCount={bootedDevicesCount}
        onRefresh={loadData}
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
      />

      {errorMessage && (
        <div className="error-banner">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>Dismiss</button>
        </div>
      )}

      <main className="main-content">
        {selectedTrace ? (
          <RunDetail trace={selectedTrace} onBack={() => setSelectedTrace(null)} />
        ) : (
          <RunList runs={runs} onSelectRun={handleSelectRun} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}

export default App;
