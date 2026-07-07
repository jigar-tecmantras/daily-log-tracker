const ManagerView = ({ employees, filter, onFilterChange }) => {
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
      <div className="manager-view__filters">
        <label>
          Employee
          <select value={filter.employeeId} onChange={handleEmployeeChange}>
            <option value="">All</option>
            {employees.map((employee) => (
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
