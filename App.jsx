import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

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
  const [stage, setStage] = useState("form");
  const [issue, setIssue] = useState("Flat tire");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [eta, setEta] = useState(12);

  const [lo, hi] = priceRange(issue);

  function submit(e) {
    e.preventDefault();
    if (!location || !phone) return alert("Add location and phone.");
    setStage("searching");
    setTimeout(() => { setStage("found"); }, 1800);
  }

  useEffect(() => {
    if (stage !== "found") return;
    setEta(12);
    const t = setInterval(() => setEta((m) => Math.max(0, m - 1)), 60000);
    return () => clearInterval(t);
  }, [stage]);

  return (
    <div className="wrap">
      <div className="logo"><span className="car">🚗</span> Roadside Tech</div>

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
                <input placeholder="123 Main St or I-64 Exit 8 shoulder"
                       value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div>
                <label>Phone (SMS)</label>
                <input placeholder="502-555-1234"
                       value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <label>Details</label>
            <textarea placeholder="Rear driver tire flat, have spare."
                      value={details} onChange={(e) => setDetails(e.target.value)} />

            <div className="inline" style={{justifyContent:"space-between", alignItems:"center", marginTop:12}}>
              <div className="muted">Estimate: <b>${lo}–${hi}</b></div>
              <button className="btn" type="submit">Request Help</button>
            </div>

            <div className="muted" style={{marginTop:10}}>
              Or call now: <a className="link" href="tel:5025934425">502-593-4425</a>
            </div>
          </form>
        </div>
      )}

      {stage === "searching" && (
        <div className="card center">
          <div className="pill">Finding your nearest tech… ⏳</div>
          <div className="muted" style={{marginTop:8}}>
            We’ll match you to the closest available technician and share an ETA.
          </div>
        </div>
      )}

      {stage === "found" && (
        <div className="card center">
          <div className="success">Tech Found ✅</div>
          <div style={{marginTop:8}}>Marcus (Silver Tacoma) accepted your job.</div>
          <div className="eta">ETA {eta > 0 ? `${eta} min` : "Arriving now"}</div>
          <div className="muted" style={{marginTop:12}}>
            Need to talk? <a className="link" href="tel:5025934425">Call your dispatcher</a>
          </div>
          <button className="btn" style={{marginTop:16}} onClick={() => setStage("form")}>New Request</button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);              value={location}
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
