import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IssueCard from '../components/IssueCard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = ({ onLogout }) => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const [credentials, setCredentials] = useState({
    loginUrl: '',
    user: '',
    pass: ''
  });
  const [results, setResults] = useState(null);
  const [scanStatus, setScanStatus] = useState(""); // e.g., "Launching Browser..."
  const [filter, setFilter] = useState('all');

  const getImpactCounts = (issues) => {
    if (!issues) return { critical: 0, serious: 0, moderate: 0, minor: 0 };
    return issues.reduce((acc, issue) => {
      acc[issue.impact] = (acc[issue.impact] || 0) + 1;
      return acc;
    }, {});
  };
  const downloadPDF = async () => {
    const element = document.getElementById('audit-report-content');
    if (!element) return;

    const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true, // Crucial for external images/icons
        backgroundColor: null // Keeps your theme's background
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`A11yReport-${selectedAudit.url.replace(/https?:\/\//, '')}.pdf`);
};

  const calculateScore = (violations) => {
    const score = 100 - (violations * 3);
    return Math.max(score, 0);
  };

  const getScoreColor = (score) => {
    if (score > 90) return 'text-success';
    if (score > 70) return 'text-warning';
    return 'text-danger';
  };

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/audit',
    headers: { Authorization: `Bearer ${token}` }
  });

  const loadHistory = async () => {
    try {
      const res = await api.get('/history');
      setHistory(res.data);
    } catch (err) { console.error("Failed to load history"); }
  };

  useEffect(() => {
    loadHistory();
    const interval = setInterval(() => { loadHistory(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const runScan = async () => {
    setLoading(true);
    setScanStatus("Initializing Scanner...");
    
    try {
        // 1. Start the scan
        const response = await api.post('/run', { 
            url, 
            loginUrl: credentials.loginUrl, 
            siteUser: credentials.user, 
            sitePass: credentials.pass,
            crawlSite: isProtected 
        });

        // 2. Keep the loading spinner active and "Poll" the history
        setScanStatus("Browser launched, auditing pages...");
        
        let scanFinished = false;
        let attempts = 0;

        // Check every 2 seconds if the new audit has appeared in history
        const pollInterval = setInterval(async () => {
            attempts++;
            const res = await api.get('/history');
            const latestAudit = res.data[0]; // Assuming newest is first

            // Check if the latest audit matches our current URL and is recent
            if (latestAudit && latestAudit.url.includes(url)) {
                setHistory(res.data);
                setSelectedAudit(latestAudit); // Automatically show the new results
                scanFinished = true;
            }

            // Stop polling if finished or timed out (e.g., after 60 seconds)
            if (scanFinished || attempts > 30) {
                clearInterval(pollInterval);
                setLoading(false);
                setScanStatus("");
                setUrl('');
            }
        }, 2000);

    } catch (err) { 
        alert("Error: " + (err.response?.data || err.message)); 
        setLoading(false);
    }
};

  const counts = selectedAudit 
    ? getImpactCounts(selectedAudit.issues) 
    : { critical: 0, serious: 0, moderate: 0, minor: 0 };

  return (
    <div className="container-fluid min-vh-100 p-0">
      {/* Top Header */}
      {/* <nav className="navbar navbar-white bg-white border-bottom px-4 py-3 sticky-top">
        <div className="container-fluid">
          <h4 className="fw-bold mb-0 text-dark">
            <span className="text-primary">A11y</span>Insights
          </h4>
          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </nav> */}

      <div className="container-fluid py-4 px-lg-5">
        <div className="row g-4">
          
          {/* LEFT COLUMN: Controls & History */}
          <div className="col-lg-4">
            {/* Run Audit Card */}
            <div className="card shadow-sm rounded-4 mb-4 bg-body-tertiary border-0"> 
           <div className="card-body p-4">
                <h6 className="text-uppercase text-muted small fw-bold mb-3">New Analysis</h6>
                <div className="mb-3">
                  <input 
                    className="form-control form-control-lg border-0 bg-body rounded-3" 
                    placeholder="https://example.com" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                  />
                </div>

                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="authToggle"
                    checked={isProtected}
                    onChange={() => setIsProtected(!isProtected)} 
                  />
                  <label className="form-check-label small text-muted" htmlFor="authToggle text-nowrap">Protected Site?</label>
                </div>

                {isProtected && (
                  <div className="p-3 bg-body rounded-3 mb-3 border border-light">
                    <input className="form-control form-control-sm mb-2" placeholder="Login URL" value={credentials.loginUrl} onChange={e => setCredentials({...credentials, loginUrl: e.target.value})} />
                    <input className="form-control form-control-sm mb-2" placeholder="Username" value={credentials.user} onChange={e => setCredentials({...credentials, user: e.target.value})} />
                    <input className="form-control form-control-sm" type="password" placeholder="Password" value={credentials.pass} onChange={e => setCredentials({...credentials, pass: e.target.value})} />
                  </div>
                )}

                <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-3" onClick={runScan} disabled={loading}>
    {loading ? 'Processing...' : 'Run Full Audit'}
</button>

{/* NEW PROGRESS SECTION */}
{loading && (
    <div className="mt-4 p-3 bg-white rounded-3 border border-primary-subtle animate-pulse">
        <div className="d-flex align-items-center mb-2">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            <span className="small fw-bold text-primary">{scanStatus}</span>
        </div>
        <div className="progress" style={{ height: '6px' }}>
            <div 
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                role="progressbar" 
                style={{ width: '100%' }}
            ></div>
        </div>
        <small className="text-muted d-block mt-2" style={{ fontSize: '10px' }}>
            This usually takes about 10-15 seconds.
        </small>
    </div>
)}
              </div>
            </div>

            {/* History List */}
            <h6 className="text-uppercase text-muted small fw-bold mb-3 px-2">History</h6>
            <div className="list-group list-group-flush rounded-4 shadow-sm overflow-hidden">
              {history.map(audit => (
                <button key={audit.id} 
                  className={`list-group-item list-group-item-action border-0 py-3 ${selectedAudit?.id === audit.id ? 'bg-primary text-white shadow' : ''}`}
                  onClick={() => setSelectedAudit(audit)}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-truncate me-2 small fw-bold">{audit.url.replace('https://','')}</span>
                    <span className={`badge rounded-pill ${selectedAudit?.id === audit.id ? 'bg-white text-primary' : 'bg-danger-subtle text-danger'}`}>
                      {audit.totalViolations}
                    </span>
                  </div>
                  <small className={`d-block mt-1 ${selectedAudit?.id === audit.id ? 'opacity-75' : 'text-muted'}`}>
                    {new Date(audit.scanDate).toLocaleDateString()}
                  </small>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          
          {/* RIGHT COLUMN: Results */}
<div className="col-lg-8">
  {/* The ID should be on the inner container so it captures ONLY the report content */}
  <div id="audit-report-content" className="bg-body rounded-4 p-3">
    {selectedAudit ? (
      <div>
        {/* Header Section */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-body-tertiary">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted small mb-1">Report for</p>
              <h4 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '300px' }}>{selectedAudit.url}</h4>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button onClick={downloadPDF} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                Export PDF
              </button>
              <div className="text-end border-start ps-3">
                <h1 className={`fw-black mb-0 ${getScoreColor(calculateScore(selectedAudit.totalViolations))}`}>
                  {calculateScore(selectedAudit.totalViolations)}%
                </h1>
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>Health Score</small>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Critical', count: counts.critical, color: 'danger' },
            { label: 'Serious', count: counts.serious, color: 'warning' },
            { label: 'Minor', count: counts.minor, color: 'info' }
          ].map((stat, i) => (
            <div className="col-4" key={i}>
              <div className={`p-3 rounded-4 border border-${stat.color} border-opacity-25 bg-${stat.color} bg-opacity-10 text-center`}>
                <h3 className={`fw-bold mb-0 text-${stat.color}`}>{stat.count || 0}</h3>
                <small className="text-uppercase fw-bold opacity-75 small text-body" style={{ fontSize: '10px' }}>{stat.label}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Issue Log Section */}
        <div className="d-flex align-items-center mb-3">
          <h5 className="fw-bold mb-0 me-2 text-body">Issue Log</h5>
          <hr className="flex-grow-1 text-muted opacity-25" />
        </div>

        {selectedAudit.issues && selectedAudit.issues.length > 0 ? (
          selectedAudit.issues.map((issue, idx) => (
            <IssueCard key={idx} issue={issue} />
          ))
        ) : (
          <div className="text-center p-5 bg-body-tertiary rounded-4">
            <h2 className="mb-2">🎉</h2>
            <p className="text-muted mb-0 text-body">Clean bill of health! No violations found.</p>
          </div>
        )}
      </div>
    ) : (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center py-5 opacity-50 text-body">
        <div className="bg-body-tertiary p-4 rounded-circle shadow-sm mb-3">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <h5>Nothing selected</h5>
        <p className="small">Choose a report from history to see details.</p>
      </div>
    )}
  </div>
</div>
        
      </div>
    </div>
    </div>
  );
};

export default Dashboard;