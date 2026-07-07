const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const STATIC_EMPLOYEES = [
  { id: 1, name: 'Alice Johnson', role: 'Employee' },
  { id: 2, name: 'Ravi Patel', role: 'Employee' },
  { id: 3, name: 'Maya Chen', role: 'Employee' },
  { id: 4, name: 'Diego Morales', role: 'Manager' }
];

const parseResponse = async (response) => {
  if (response.ok) {
    return response.json();
  }

  const text = await response.text();
  throw new Error(text || 'Request failed.');
};

const fallbackEmployees = (reason) => {
  console.warn(`Unable to load employees from API (${reason}). Using static employee list.`);
  return STATIC_EMPLOYEES;
};

export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/employees`);

    if (!response.ok) {
      return fallbackEmployees(`status ${response.status}`);
    }

    return parseResponse(response);
  } catch (error) {
    return fallbackEmployees(error?.message || 'network error');
  }
};

const fetchWithJson = (endpoint) =>
  fetch(endpoint).then(parseResponse);

export const fetchLogs = (employeeId) => {
  const query = employeeId ? `?employeeId=${employeeId}` : '';
  return fetchWithJson(`${API_BASE}/api/logs${query}`);
};

export const submitLog = (payload) =>
  fetch(`${API_BASE}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(parseResponse);
