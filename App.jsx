import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// 🔔 Your Formspree endpoint (already created)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdkwblrv";

// Simple price estimator shown on the form
function priceRange(issue) {
  switch (issue) {
    case "Flat tire": return [59, 99];
    case "Jump start": return [49, 79];
    case "Out of fuel": return [59, 89];
    case "Lockout": return [69, 119];
    case "Diagnostic": return [59, 129];
    default: return [49, 149];
  }
}

function App() {
  // form | searching | found
  const [stage, setStage] = useState("form");

  const [issue, setIssue] = useState("Flat tire");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");

  const [eta, setEta] = useState(12);
  const [sent, setSent] = useState(false);

  const [lo, hi] = priceRange(issue);

  // Submit — sends an alert to Formspree, then shows “searching” and “found”
  async function submit(e) {
    e.preventDefault();
    if (!location || !phone) {
      alert("Please enter location and phone.");
      return;
    }

    setStage("searching");

    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "New Roadside Request",
          issue,
          location,
          phone,
          details,
          estimate: `$${lo}–$${hi}`,
          submitted_at: new Date().toISOString(),
        }),
      });
      setSent(true);
    } catch (err) {
      console.error("Formspree error:", err);
    }

    // Mock a short “tech matching” delay
    setTimeout(() => setStage("found"), 1800);
  }

  // Countdown ETA after a tech is found
  useEffect(() => {
    if (stage !== "found") return;
    setEta(12);
    const t = setInterval(() => setEta((m) => Math.max(0, m - 1)), 60000);
    return () => clearInterval(t);
  }, [stage]);

  // Stripe: start checkout for $25 deposit
  async function startDepositCheckout() {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe-hosted Checkout
      } else {
        alert("Payment error: " + (data.error || "Unable to start checkout"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error starting checkout.");
    }
  }

  return (
    <div className="wrap">
      <div className="logo">
        <span className="car">🚗</span> Roadside Tech
      </div>

      {/* ===== Form Stage ===== */}
      {stage === "form" && (
        <div className="card">
          <div className="pill topnote">Instant roadside help in Louisville area</div>

          <form onSubmit={submit}>
            <label>Issue</label>
            <select value={issue} onChange={(e) => setIssue(e.target.value)}>
              <option>Flat tire</option>
              <option>Jump start</option>
              <option>Out of fuel</option>
              <option>Lockout</option>
              <option>Diagnostic</option>
            </select>

            <div className="row">
              <div>
                <label>Location</label>
                <input
                  placeholder="123 Main St or I-64 Exit 8 shoulder"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Phone (SMS)</label>
                <input
                  placeholder="502-555-1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <label>Details</label>
            <textarea
              placeholder="Rear driver tire flat, have spare."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />

            <div
              className="inline"
              style={{ justifyContent: "space-between", alignItems: "center", marginTop: 12 }}
            >
              <div className="muted">
                Estimate: <b>${lo}–${hi}</b>
              </div>
              <button className="btn" type="submit">
                Request Help
              </button>
            </div>

            <div className="muted" style={{ marginTop: 10 }}>
              Or call now:{" "}
              <a className="link" href="tel:5025934425">
                502-593-4425
              </a>
            </div>
          </form>
        </div>
      )}

      {/* ===== Searching Stage ===== */}
      {stage === "searching" && (
        <div className="card center">
          <div className="pill">Finding your nearest tech… ⏳</div>
          <div className="muted" style={{ marginTop: 8 }}>
            We’ll match you to the closest available technician and share an ETA.
          </div>
        </div>
      )}

      {/* ===== Found Stage ===== */}
      {stage === "found" && (
        <div className="card center">
          <div className="success">Tech Found ✅</div>
          <div style={{ marginTop: 8 }}>Marcus (Silver Tacoma) accepted your job.</div>
          <div className="eta">ETA {eta > 0 ? `${eta} min` : "Arriving now"}</div>

          {sent && (
            <div className="muted" style={{ marginTop: 12 }}>
              We’ve alerted dispatch with your details.
            </div>
          )}

          {/* Stripe deposit button */}
          <button
            onClick={startDepositCheckout}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 600,
              marginTop: 16,
            }}
          >
            Pay $25 Deposit
          </button>

          <div className="muted" style={{ marginTop: 8 }}>
            Deposit is applied to service. Fully refundable if canceled before dispatch.
          </div>

          <div className="muted" style={{ marginTop: 12 }}>
            Need to talk?{" "}
            <a className="link" href="tel:5025934425">
              Call your dispatcher
            </a>
          </div>

          <button className="btn" style={{ marginTop: 16 }} onClick={() => setStage("form")}>
            New Request
          </button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
