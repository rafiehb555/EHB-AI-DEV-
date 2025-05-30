export default function Minimal() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "blue" }}>Minimal Test Page</h1>
      <p>This is a minimal test page without any Tailwind classes.</p>
      <div style={{ marginTop: "20px" }}>
        <strong>System Info:</strong>
        <ul>
          <li>Environment: {process.env.NODE_ENV}</li>
          <li>Time: {new Date().toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
}