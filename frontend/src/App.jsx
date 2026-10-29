
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend health check failed");
        }
        return response.json();
      })
      .then((data) => setHealth(data.status))
      .catch(() => {
        setHealth("Unavailable");
        setError("Could not connect to the backend API.");
      });
  }, []);

  return (
    <main className="container">
      <h1>NexusFinance</h1>
      <p>Digital Banking Platform</p>
      <section className="status">
        <h2>Backend API Status</h2>
        <p>{health}</p>
        {error && <p>{error}</p>}
      </section>
    </main>
  );
}

export default App;
