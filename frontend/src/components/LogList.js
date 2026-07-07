const LogList = ({ logs }) => (
  <section className="log-list">
    <h2>Recent logs</h2>
    {logs.length === 0 ? (
      <p className="empty-state">No logs available yet.</p>
    ) : (
      logs.map((log) => (
        <article key={log.id} className="log-card">
          <header>
            <div>
              <strong>{log.employeeName}</strong>
              <span>{new Date(log.date).toLocaleDateString()}</span>
            </div>
            <span className="log-card__status">{log.status}</span>
          </header>
          <p>{log.summary}</p>
          <footer>
            <small>Submitted at {new Date(log.createdAt).toLocaleString()}</small>
          </footer>
        </article>
      ))
    )}
  </section>
);

export default LogList;
