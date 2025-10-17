import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [stage, setStage] = useState("form");
  const [issue, setIssue] = useState("Flat tire");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setStage("searching");
    setTimeout(() => setStage("found"), 2000);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>🚗 Roadside Tech</h1>
      {stage === "form" && (
        <form onSubmit={handleSubmit}>
          <label>
            Issue:
            <select value={issue} onChange={(e) => setIssue(e.target.value)}>
              <option>Flat tire</option>
              <option>Jump start</option>
              <option>Out of fuel</option>
              <option>Lockout</option>
              <option>Diagnostic</option>
            </select>
          </label>
          <br /><br />
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="123 Main St or I-64 Exit 8"
              required
            />
          </label>
          <br /><br />
          <label>
            Phone:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="555-555-5555"
              required
            />
          </label>
          <br /><br />
          <label>
            Details:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Rear tire flat, have spare."
            />
          </label>
          <br /><br />
          <button type="submit">Request Help</button>
        </form>
      )}

      {stage === "searching" && (
        <p>Finding your nearest tech… please wait ⏳</p>
      )}

      {stage === "found" && (
        <div>
          <h3>Tech Found ✅</h3>
          <p>Marcus (Silver Tacoma) is 12 minutes away!</p>
          <button onClick={() => setStage("form")}>New Request</button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
