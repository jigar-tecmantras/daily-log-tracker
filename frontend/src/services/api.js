const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const parseResponse = async (response) => {
  if (response.ok) {
    return response.json();
  }

  const text = await response.text();
  throw new Error(text || 'Request failed.');
};

export const fetchEmployees = () => fetch(`${API_BASE}/api/employees`).then(parseResponse);

export const fetchLogs = (employeeId) => {
  const query = employeeId ? `?employeeId=${employeeId}` : '';
  return fetch(`${API_BASE}/api/logs${query}`).then(parseResponse);
};

export const submitLog = (payload) =>
  fetch(`${API_BASE}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(parseResponse);
