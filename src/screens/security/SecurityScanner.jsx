import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ScanFace, CheckCircle, XCircle, LogIn, LogOut, FileText } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { getOutpass } from '../../api/outpasses';

export const SecurityScanner = () => {
  const { user, outpasses, updateOutpassStatus, addLog, logs, fetchOutpasses } = useApp();
  const navigate = useNavigate();
  const [liveScanning, setLiveScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [scannedOutpass, setScannedOutpass] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (!user || user.role !== 'security') return null;

  const handleActualScan = async (text) => {
    try {
      const data = JSON.parse(text);
      const outpassData = await getOutpass(data.id);
      if (outpassData && (outpassData.status === 'approved' || outpassData.status === 'active')) {
        setScannedOutpass(outpassData); setScannedResult('success');
      } else { setScannedResult('error'); }
      setLiveScanning(false);
    } catch { setScannedResult('error'); setLiveScanning(false); }
  };

  const processGateAction = async (type) => {
    if (type === 'exit' && scannedOutpass.status !== 'approved') { alert('Student already exited.'); return; }
    if (type === 'entry' && scannedOutpass.status !== 'active') { alert('Student not currently outside.'); return; }
    setProcessing(true);
    try {
      await updateOutpassStatus(scannedOutpass._id, type === 'exit' ? 'active' : 'completed');
      await addLog(scannedOutpass, type);
      await fetchOutpasses();
      setScannedResult(null); setScannedOutpass(null);
      alert(`Student ${type} recorded!`);
    } catch (err) { alert(err?.response?.data?.message || 'Gate action failed.'); }
    finally { setProcessing(false); }
  };

  const studentsOut   = outpasses.filter(o => o.status === 'active').length;
  const returnedToday = logs.filter(l => l.type === 'entry').length;

  return (
    <div className="space-y-5 animate-fade-slide-up max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">Gate Security</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.gate} · Scanner Active</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center py-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Students Outside</p>
          <p className="text-3xl font-extrabold text-amber-500">{studentsOut}</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Entries Today</p>
          <p className="text-3xl font-extrabold text-emerald-500">{returnedToday}</p>
        </Card>
      </div>

      {/* Log link */}
      <Button variant="secondary" fullWidth onClick={() => navigate('/security/logs')}>
        <FileText size={18} /> View Complete Log
      </Button>

      {/* Scanner area */}
      {!scannedResult ? (
        <Card className="flex flex-col items-center py-8 gap-6">
          {liveScanning ? (
            <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-lg">
              <Scanner
                onScan={result => { if (result?.length) handleActualScan(result[0].rawValue); }}
                onError={console.error}
              />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-36 h-36 bg-slate-100 dark:bg-slate-800 rounded-3xl">
              <ScanFace size={64} className="text-slate-400 dark:text-slate-500" />
              <div className="absolute inset-0 scan-line-bar rounded-3xl" />
            </div>
          )}

          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
              {liveScanning ? 'Point camera at QR code' : 'Ready to Scan'}
            </h3>
            {!liveScanning && <p className="text-sm text-slate-500 dark:text-slate-400">Tap below to activate the camera.</p>}
          </div>

          <Button fullWidth size="lg" variant={liveScanning ? 'secondary' : 'primary'}
            onClick={() => setLiveScanning(!liveScanning)}>
            {liveScanning ? 'Cancel Camera' : 'Scan the Outpass'}
          </Button>
        </Card>
      ) : scannedResult === 'error' ? (
        <Card className="flex flex-col items-center py-10 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <XCircle size={60} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Invalid Pass</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5">QR not recognized or pass not approved.</p>
          <Button variant="secondary" fullWidth onClick={() => setScannedResult(null)}>Try Again</Button>
        </Card>
      ) : (
        <Card className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Access Verified</h2>
          <p className="text-xs font-mono text-slate-400 mb-5">{scannedOutpass._id.slice(-8).toUpperCase()}</p>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 w-full mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-bold flex items-center justify-center text-lg flex-shrink-0">
              {scannedOutpass.studentName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{scannedOutpass.studentName}</p>
              <p className="text-xs text-slate-400 font-mono tracking-wide">{scannedOutpass.studentRollNo || `${scannedOutpass.studentProgram} ${scannedOutpass.studentBatch}`} · {scannedOutpass.reason}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button variant="secondary" size="lg" className="border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400"
              onClick={() => processGateAction('exit')} isLoading={processing}>
              <LogOut size={18} /> Exit
            </Button>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => processGateAction('entry')} isLoading={processing}>
              <LogIn size={18} /> Entry
            </Button>
          </div>
        </Card>
      )}

      {/* Recent activity */}
      {logs.length > 0 && !scannedResult && (
        <Card>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Recent Activity</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {logs.slice(0, 3).map((log, i) => (
              <div key={log._id || i} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${log.type === 'entry' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                    {log.type === 'entry' ? 'IN' : 'OUT'}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{log.studentName}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Intl.DateTimeFormat('en-US', { hour:'2-digit', minute:'2-digit' }).format(new Date(log.timestamp))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
