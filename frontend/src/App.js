import { useCallback, useEffect, useMemo, useState } from 'react';
import LogForm from './components/LogForm';
import LogList from './components/LogList';
import ManagerView from './components/ManagerView';
import { fetchEmployees, fetchLogs, submitLog } from './services/api';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState('employee');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [managerFilter, setManagerFilter] = useState({ employeeId: '', sinceDate: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const loadEmployees = useCallback(async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch {
      setError('Unable to load employees.');
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    if (employees.length && selectedEmployeeId === null) {
      setSelectedEmployeeId(employees[0].id);
    }
  }, [employees, selectedEmployeeId]);

  const refreshLogs = useCallback(async () => {
    if (role === 'employee' && !selectedEmployeeId) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const employeeIdFilter =
        role === 'manager' && managerFilter.employeeId
          ? Number(managerFilter.employeeId)
          : null;

      const targetEmployeeId = role === 'employee' ? selectedEmployeeId : employeeIdFilter;
      const data = await fetchLogs(targetEmployeeId ?? undefined);
      setLogs(data);
    } catch {
      setError('Unable to load logs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [role, selectedEmployeeId, managerFilter.employeeId]);

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  const handleRoleChange = (value) => {
    setRole(value);
    setStatusMessage('');
    setError('');
  };

  const handleLogSave = useCallback(
    async (payload) => {
      setStatusMessage('');
      setError('');
      await submitLog(payload);
      setStatusMessage('Daily log submitted successfully.');
      await refreshLogs();
    },
    [refreshLogs]
  );

  const visibleLogs = useMemo(() => {
    if (role !== 'manager') {
      return logs;
    }

    if (!managerFilter.sinceDate) {
      return logs;
    }

    const since = new Date(managerFilter.sinceDate);
    return logs.filter((log) => new Date(log.date) >= since);
  }, [logs, role, managerFilter.sinceDate]);

  return (
    <div className="app-container">
      <header className="app-header">
        <p className="eyebrow">Team Operations</p>
        <h1>Daily Log Tracker</h1>
        <p>
          Everyone records a short summary once per day. Managers can review the whole team’s progress with
          optional filters.
        </p>
      </header>

      <section className="role-switch">
        <label>
          <input
            type="radio"
            name="role"
            value="employee"
            checked={role === 'employee'}
            onChange={() => handleRoleChange('employee')}
          />
          Employee
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="manager"
            checked={role === 'manager'}
            onChange={() => handleRoleChange('manager')}
          />
          Manager
        </label>
      </section>

      {role === 'employee' && (
        <LogForm
          employees={employees}
          defaultEmployeeId={selectedEmployeeId ?? undefined}
          onSave={handleLogSave}
        />
      )}

      {role === 'manager' && (
        <ManagerView employees={employees} filter={managerFilter} onFilterChange={setManagerFilter} />
      )}

      {statusMessage && <div className="status-message">{statusMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading logs…</div>
      ) : (
        <LogList logs={visibleLogs} />
      )}
    </div>
  );
}

export default App;
