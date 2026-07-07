const ManagerView = ({ employees, filter, onFilterChange }) => {
  const hasEmployees = Array.isArray(employees) && employees.length > 0;
  const sortedEmployees = hasEmployees
    ? [...employees].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleEmployeeChange = (event) => {
    onFilterChange({ ...filter, employeeId: event.target.value });
  };

  const handleDateChange = (event) => {
    onFilterChange({ ...filter, sinceDate: event.target.value });
  };

  const handleClear = () => {
    onFilterChange({ employeeId: '', sinceDate: '' });
  };

  return (
    <section className="manager-view">
      <div className="manager-view__header">
        <h2>Manager dashboard</h2>
        <p>Slice the log list by employee or by date to spotlight the right daily story.</p>
      </div>

      {hasEmployees ? (
        <div className="manager-view__roster">
          {sortedEmployees.map((employee) => (
            <article key={employee.id} className="manager-view__card">
              <div>
                <h3>{employee.name}</h3>
                <p className="manager-view__subtitle">{employee.role}</p>
              </div>
              <span className="manager-view__role-chip">{employee.role}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="manager-view__empty">No employees are available yet.</p>
      )}

      <div className="manager-view__filters">
        <label>
          Employee
          <select value={filter.employeeId} onChange={handleEmployeeChange}>
            <option value="">All</option>
            {sortedEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Since
          <input type="date" value={filter.sinceDate} onChange={handleDateChange} />
        </label>
        <button type="button" className="ghost-button" onClick={handleClear}>
          Clear filters
        </button>
      </div>
    </section>
  );
};

export default ManagerView;
