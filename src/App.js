// Import CSS file and React hooks
import './index.css';
import { useState, useMemo } from 'react';

// Shared currency formatter (so we show money like $1,200.00 consistently)
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Initial list of bills (mock data) with IDs for stable keys
const billsList = [
  { id: 1, name: 'Rent', amount: 1200 },
  { id: 2, name: 'Electricity', amount: 150 },
  { id: 3, name: 'Water', amount: 50 },
  { id: 4, name: 'Internet', amount: 60 },
  { id: 5, name: 'Phone', amount: 80 },
];

// ============================
// MAIN APP COMPONENT
// ============================
function App() {
  // ---------------- STATE ----------------
  // List of all bills currently displayed
  const [currentBills, setCurrentBills] = useState(billsList);

  // Controls visibility of the "Add New Bill" form
  const [showAddBillForm, setShowAddBillForm] = useState(false);

  // ---------------- DERIVED VALUE ----------------
  // Calculates the total amount of all bills.
  // useMemo ensures this only recalculates when bills change.
  const total = useMemo(
    () => currentBills.reduce((sum, b) => sum + Number(b.amount || 0), 0),
    [currentBills]
  );

  // ---------------- HANDLERS ----------------

  // Toggles the Add Bill form open/closed
  function handleShowAddBill() {
    setShowAddBillForm((show) => !show);
  }

  // Adds a new bill to the list with a unique id
  function handleAddBill(bill) {
    const id = Date.now(); // simple unique id based on timestamp
    setCurrentBills((prev) => [...prev, { ...bill, id }]);
  }

  // Removes a bill by filtering it out of the list
  function handleDeleteBill(id) {
    setCurrentBills((prev) => prev.filter((b) => b.id !== id));
  }

  // Updates a specific bill (e.g. after editing)
  function handleUpdateBill(updated) {
    setCurrentBills((prev) =>
      prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="App">
      <div className="container">
        {/* ---------- HEADER ---------- */}
        <header className="header">
          <h1 className="title">Bills Tracker</h1>
          <p className="subtitle">Keep an eye on your monthly expenses</p>
          <div className="total-chip">
            Total this month: <strong>{usd.format(total)}</strong>
          </div>
        </header>

        {/* ---------- MAIN CONTENT ---------- */}
        <main className="content">
          {/* Left side: list of bills */}
          <section className="bills-section">
            <h2 className="section-title">Your Bills</h2>

            {/* Pass down delete and update handlers */}
            <BillList
              bills={currentBills}
              onDelete={handleDeleteBill}
              onUpdate={handleUpdateBill}
            />
          </section>

          {/* Right side: Add form + button */}
          <section className="actions-section">
            <button className="btn btn-primary" onClick={handleShowAddBill}>
              {showAddBillForm ? 'Close' : 'Add New Bill'}
            </button>

            {/* Conditionally render AddBillForm */}
            {showAddBillForm && (
              <AddBillForm
                onAdd={handleAddBill}
                onClose={() => setShowAddBillForm(false)}
              />
            )}
          </section>
        </main>

        {/* ---------- FOOTER ---------- */}
        <footer className="footer">&copy; 2024 Bills Tracker Project</footer>
      </div>
    </div>
  );
}

// ============================
// COMPONENT: BillList
// Renders all bills as individual Bill components
// ============================
function BillList({ bills, onDelete, onUpdate }) {
  return (
    <div className="bills-grid">
      {bills.map((bill) => (
        <Bill
          key={bill.id}
          bill={bill}
          onDelete={() => onDelete(bill.id)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

// ============================
// COMPONENT: Bill
// Displays a single bill with Edit/Delete controls
// ============================
function Bill({ bill, onDelete, onUpdate }) {
  // Local edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Local form values for name/amount (only used while editing)
  const [draftName, setDraftName] = useState(bill.name);
  const [draftAmount, setDraftAmount] = useState(String(bill.amount));

  // Begin editing
  function startEdit() {
    setDraftName(bill.name);
    setDraftAmount(String(bill.amount));
    setIsEditing(true);
  }

  // Cancel editing and restore original values
  function cancelEdit() {
    setIsEditing(false);
    setDraftName(bill.name);
    setDraftAmount(String(bill.amount));
  }

  // Validate and save changes
  function saveEdit() {
    const name = draftName.trim();
    const amount = Number(draftAmount);

    if (!name) return alert('Please enter a bill name.');
    if (!Number.isFinite(amount) || amount <= 0)
      return alert('Please enter a valid positive amount.');

    // Tell parent to update this bill
    onUpdate({ id: bill.id, name, amount });

    // Exit edit mode
    setIsEditing(false);
  }

  // Render both display and edit modes
  return (
    <article className="bill-card">
      <div className="bill-icon" aria-hidden>
        💳
      </div>

      {/* ---------- VIEW MODE ---------- */}
      {!isEditing ? (
        <div className="bill-info">
          <h3 className="bill-name">{bill.name}</h3>
          <p className="bill-amount">{usd.format(bill.amount)}</p>

          <div className="form-actions" style={{ marginTop: 8 }}>
            {/* Switch to edit mode */}
            <button className="btn btn-ghost" onClick={startEdit}>
              Edit
            </button>
            {/* Delete bill */}
            <button className="btn btn-ghost" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        /* ---------- EDIT MODE ---------- */
        <div className="bill-info">
          {/* Name input */}
          <label className="field">
            <span className="label">Bill Name</span>
            <input
              className="input"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="e.g. Gym"
            />
          </label>

          {/* Amount input */}
          <label className="field">
            <span className="label">Amount</span>
            <input
              className="input"
              type="number"
              value={draftAmount}
              onChange={(e) => setDraftAmount(e.target.value)}
              min="1"
              step="1"
              placeholder="e.g. 299"
            />
          </label>

          {/* Save / Cancel buttons */}
          <div className="form-actions" style={{ marginTop: 8 }}>
            <button className="btn btn-success" onClick={saveEdit}>
              Save
            </button>
            <button className="btn btn-ghost" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// ============================
// COMPONENT: AddBillForm
// Form for adding a brand new bill
// ============================
function AddBillForm({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = name.trim();
    const value = Number(amount);

    if (!trimmed) return alert('Please enter a bill name.');
    if (!Number.isFinite(value) || value <= 0)
      return alert('Please enter a valid positive amount.');

    // Send new bill object to parent
    onAdd({ name: trimmed, amount: value });

    // Reset form fields
    setName('');
    setAmount('');

    // Optionally close the form after adding
    if (onClose) onClose();
  }

  return (
    <div className="form-card">
      <h2 className="section-title">Add a new bill</h2>

      {/* onSubmit calls handleSubmit */}
      <form onSubmit={handleSubmit} className="form">
        {/* Bill name input */}
        <label className="field">
          <span className="label">Bill Name</span>
          <input
            type="text"
            name="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Gym"
          />
        </label>

        {/* Bill amount input */}
        <label className="field">
          <span className="label">Amount</span>
          <input
            type="number"
            name="amount"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 299"
            step="1"
            min="1"
          />
        </label>

        {/* Submit and cancel buttons */}
        <div className="form-actions">
          <input type="submit" value="Add Bill" className="btn btn-success" />
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Export the main component
export default App;
