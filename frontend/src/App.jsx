
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/transactions";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("credit");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load transactions");

      const data = await response.json();
      setTransactions(data);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!description.trim() || !amount || Number(amount) <= 0) {
      setError("Enter a description and a valid positive amount.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          amount: Number(amount),
          transaction_type: transactionType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not add transaction");
      }

      setDescription("");
      setAmount("");
      await fetchTransactions();
    } catch (err) {
      setError(err.message || "Unable to save transaction");
    } finally {
      setSaving(false);
    }
  };

  const totalCredits = transactions
    .filter((item) => item.transaction_type === "credit")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalDebits = transactions
    .filter((item) => item.transaction_type === "debit")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalCredits - totalDebits;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  return (
    <main className="dashboard">
      <header className="header">
        <div>
          <h1>NexusFinance</h1>
          <p>Digital Banking Platform</p>
        </div>
        <span className="status">● Backend connected</span>
      </header>

      <section className="summary">
        <article className="summary-card balance-card">
          <p>Net Balance</p>
          <h2>{formatCurrency(balance)}</h2>
        </article>

        <article className="summary-card">
          <p>Total Credits</p>
          <h2>{formatCurrency(totalCredits)}</h2>
        </article>

        <article className="summary-card">
          <p>Total Debits</p>
          <h2>{formatCurrency(totalDebits)}</h2>
        </article>
      </section>

      <section className="content">
        <div className="panel">
          <h2>Add Transaction</h2>

          <form onSubmit={handleSubmit}>
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g. Salary or Shopping"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <label>Amount (INR)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />

            <label>Transaction Type</label>
            <select
              value={transactionType}
              onChange={(event) => setTransactionType(event.target.value)}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Transaction"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </div>

        <div className="panel">
          <h2>Recent Transactions</h2>

          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions yet. Add your first transaction.</p>
          ) : (
            <div className="transaction-list">
              {transactions.map((item) => (
                <div className="transaction" key={item.id}>
                  <div>
                    <strong>{item.description}</strong>
                    <small>
                      {new Date(item.created_at).toLocaleString("en-IN")}
                    </small>
                  </div>

                  <strong
                    className={
                      item.transaction_type === "credit" ? "credit" : "debit"
                    }
                  >
                    {item.transaction_type === "credit" ? "+" : "-"}
                    {formatCurrency(Number(item.amount))}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        NexusFinance | React + Node.js + PostgreSQL + Kubernetes
      </footer>
    </main>
  );
}

export default App;
