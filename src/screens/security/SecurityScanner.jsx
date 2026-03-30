import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ScanFace, CheckCircle, XCircle, LogIn, LogOut, FileText } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import './SecurityScanner.css';

export const SecurityScanner = () => {
  const { user, outpasses, updateOutpassStatus, addLog, logs } = useApp();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [liveScanning, setLiveScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null); // success, error, or null
  const [scannedOutpass, setScannedOutpass] = useState(null);
  
  if (!user || user.role !== 'security') return null;

  const simulateScan = () => {
    setScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      setScanning(false);
      // Mock scanning logic: grab the first approved or active outpass for demo
      const validOutpass = outpasses.find(o => o.status === 'approved' || o.status === 'active');
      
      if (validOutpass) {
        setScannedOutpass(validOutpass);
        setScannedResult('success');
      } else {
        setScannedResult('error');
      }
    }, 2000);
  };

  const handleActualScan = (text) => {
    try {
      const data = JSON.parse(text);
      const outpassId = data.id;
      const validOutpass = outpasses.find(o => o.id === outpassId);
      
      if (validOutpass && (validOutpass.status === 'approved' || validOutpass.status === 'active')) {
        setScannedOutpass(validOutpass);
        setScannedResult('success');
        setLiveScanning(false);
      } else {
        setScannedResult('error');
        setLiveScanning(false);
      }
    } catch (err) {
      setScannedResult('error');
      setLiveScanning(false);
    }
  };

  const processGateAction = (type) => {
    // If exit, ensure it was 'approved'
    if (type === 'exit') {
      if (scannedOutpass.status !== 'approved') return alert('Failed: Student has already exited or pass is invalid for exit.');
      updateOutpassStatus(scannedOutpass.id, 'active');
    }
    
    // If entry, ensure it was 'active'
    if (type === 'entry') {
      if (scannedOutpass.status !== 'active') return alert('Failed: Student is not currently marked as outside the campus.');
      updateOutpassStatus(scannedOutpass.id, 'completed');
    }
    
    addLog(scannedOutpass, type);
    
    // Reset scanner
    setScannedResult(null);
    setScannedOutpass(null);
    alert(`Student ${type} recorded successfully!`);
  };

  const studentsOut = outpasses.filter(o => o.status === 'active').length;
  const returnedToday = logs.filter(l => l.type === 'entry').length;

  return (
    <div className="security-scanner">
      <div className="scanner-header text-center">
        <h1 className="text-h2">Gate Security</h1>
        <p className="text-muted text-sm">{user.gate} Scanner • Active</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
        <Card style={{padding: '12px', textAlign: 'center'}}>
          <p className="text-xs text-muted">Students Outside</p>
          <h2 className="text-h2" style={{color: 'var(--warning)'}}>{studentsOut}</h2>
        </Card>
        <Card style={{padding: '12px', textAlign: 'center'}}>
          <p className="text-xs text-muted">Entries Logged (Today)</p>
          <h2 className="text-h2" style={{color: 'var(--success)'}}>{returnedToday}</h2>
        </Card>
      </div>

      <div style={{display: 'flex', gap: 12, marginBottom: 24}}>
        <Button variant="secondary" fullWidth onClick={() => navigate('/security/logs')}>
          <FileText size={18} /> View Complete Log
        </Button>
      </div>

      {!scannedResult ? (
        <Card className="scanner-card">
          {liveScanning ? (
            <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 24, alignSelf: 'center' }}>
              <Scanner
                onScan={(result) => {
                  if (result && result.length > 0) {
                    handleActualScan(result[0].rawValue);
                  }
                }}
                onError={(error) => console.log(error?.message)}
              />
            </div>
          ) : (
            <>
              <div className={`camera-frame ${scanning ? 'scanning-animation' : ''}`}>
                 <ScanFace size={64} className="camera-icon" />
                 {scanning && <div className="scan-line"></div>}
              </div>
              
              <h3 className="text-h3 text-center" style={{marginTop: 24, marginBottom: 8}}>
                {scanning ? 'Scanning...' : 'Ready to Scan'}
              </h3>
              <p className="text-muted text-sm text-center" style={{marginBottom: 32}}>
                Tap 'Scan the Outpass' to scan a live student QR pass.
              </p>
            </>
          )}

          <div style={{display: 'flex', gap: 12, width: '100%'}}>
            {!liveScanning ? (
              <Button fullWidth size="lg" onClick={() => setLiveScanning(true)}>
                Scan the Outpass
              </Button>
            ) : (
              <Button fullWidth size="lg" variant="secondary" onClick={() => setLiveScanning(false)}>
                Cancel Camera
              </Button>
            )}
          </div>
        </Card>
      ) : scannedResult === 'error' ? (
        <Card className="scanner-card error-card">
          <XCircle size={64} color="var(--danger)" style={{marginBottom: 16}} />
          <h2 className="text-h2 text-center" style={{color: 'var(--danger)', marginBottom: 8}}>Invalid Pass</h2>
          <p className="text-center text-muted" style={{marginBottom: 24}}>This QR code is not recognized or not approved.</p>
          <Button variant="secondary" fullWidth onClick={() => setScannedResult(null)}>Try Again</Button>
        </Card>
      ) : (
        <Card className="scanner-card success-card">
          <CheckCircle size={48} color="var(--success)" style={{marginBottom: 16}} />
          <h2 className="text-h2 text-center" style={{color: 'var(--success)', marginBottom: 4}}>Access Verified</h2>
          <p className="font-semibold text-center text-body" style={{marginBottom: 24}}>{scannedOutpass.id}</p>
          
          <div className="scanned-student-info">
            <div className="avatar" style={{width: 48, height: 48}}>{scannedOutpass.studentName.charAt(0)}</div>
            <div>
              <p className="font-medium">{scannedOutpass.studentName}</p>
              <p className="text-xs text-muted">{scannedOutpass.studentProgram} {scannedOutpass.studentBatch} • Request reason: {scannedOutpass.reason}</p>
            </div>
          </div>

          <div style={{display: 'flex', gap: 12, width: '100%', marginTop: 24}}>
            <Button variant="secondary" fullWidth style={{borderColor: 'var(--primary)', color: 'var(--primary)'}} onClick={() => processGateAction('exit')}>
              <LogOut size={18} /> Exit
            </Button>
            <Button variant="primary" style={{backgroundColor: 'var(--success)'}} fullWidth onClick={() => processGateAction('entry')}>
              <LogIn size={18} /> Entry
            </Button>
          </div>
        </Card>
      )}

      {logs.length > 0 && !scannedResult && (
        <Card style={{marginTop: '16px', padding: '16px'}}>
          <h3 className="text-sm font-semibold" style={{marginBottom: '12px'}}>Recent Activity</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {logs.slice(0, 3).map((log, i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', paddingBottom: '8px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{color: log.type === 'entry' ? 'var(--success)' : 'var(--warning)', fontWeight: 600}}>
                    {log.type === 'entry' ? 'IN' : 'OUT'}
                  </span>
                  <span>{log.studentName}</span>
                </div>
                <span className="text-xs text-muted">Just now</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
