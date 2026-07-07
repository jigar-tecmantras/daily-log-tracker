import { useEffect, useState } from 'react';

const statuses = ['In Progress', 'Completed', 'Blocked', 'Needs Review'];

const LogForm = ({ employees, defaultEmployeeId, onSave }) => {
  const [formData, setFormData] = useState({
    employeeId: defaultEmployeeId ?? '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    status: statuses[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  useEffect(() => {
    if (!formData.employeeId && defaultEmployeeId) {
      setFormData((prev) => ({ ...prev, employeeId: defaultEmployeeId }));
    }
  }, [defaultEmployeeId, formData.employeeId]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.employeeId) {
      setFeedback({ error: 'Please select an employee.', success: '' });
      return;
    }

    setSubmitting(true);
    setFeedback({ error: '', success: '' });

    try {
      await onSave({
        employeeId: Number(formData.employeeId),
        date: formData.date,
        summary: formData.summary.trim(),
        status: formData.status
      });

      setFeedback({ error: '', success: 'Daily log recorded.' });
      setFormData((prev) => ({ ...prev, summary: '', status: statuses[0] }));
    } catch (error) {
      setFeedback({
        error: error?.message || 'Unable to save the log. Please try again.',
        success: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="log-form">
      <h2>Add daily log</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Employee
          <select value={formData.employeeId} onChange={handleChange('employeeId')}>
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={formData.date} onChange={handleChange('date')} />
        </label>
        <label>
          Status
          <select value={formData.status} onChange={handleChange('status')}>
            {statuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </label>
        <label className="log-form__summary">
          Summary
          <textarea
            value={formData.summary}
            onChange={handleChange('summary')}
            placeholder="Summarize your daily accomplishments or blockers..."
            rows={4}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save log'}
        </button>
        {feedback.error && <p className="form-error">{feedback.error}</p>}
        {feedback.success && <p className="form-success">{feedback.success}</p>}
      </form>
    </section>
  );
};

export default LogForm;
