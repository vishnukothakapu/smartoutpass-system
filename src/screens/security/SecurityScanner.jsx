import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ScanFace, CheckCircle, XCircle, LogIn, LogOut, FileText,
  AlertTriangle, Building2, Hash, Phone, BookOpen,
} from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { getOutpass } from '../../api/outpasses';

export const SecurityScanner = () => {
  const { user, outpasses, updateOutpassStatus, addLog, logs, fetchOutpasses } = useApp();
  const navigate = useNavigate();
  const [liveScanning, setLiveScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null); // 'success' | 'error' | 'already_done'
  const [scannedOutpass, setScannedOutpass] = useState(null);
  const [gateAction, setGateAction] = useState(null); // 'exit' | 'entry'
  const [processing, setProcessing] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  if (!user || user.role !== 'security') return null;

  const handleActualScan = async (text) => {
    try {
      const data = JSON.parse(text);
      const outpassData = await getOutpass(data.id);

      if (!outpassData) {
        setScannedResult('error');
        setLiveScanning(false);
        return;
      }

      if (outpassData.status === 'approved') {
        // Approved but hasn't exited yet → auto-select EXIT
        setScannedOutpass(outpassData);
        setGateAction('exit');
        setScannedResult('success');
      } else if (outpassData.status === 'active') {
        // Currently outside → auto-select ENTRY
        setScannedOutpass(outpassData);
        setGateAction('entry');
        setScannedResult('success');
      } else if (outpassData.status === 'completed') {
        setScannedOutpass(outpassData);
        setScannedResult('already_done');
      } else {
        // pending / rejected
        setScannedResult('error');
      }
      setLiveScanning(false);
    } catch {
      setScannedResult('error');
      setLiveScanning(false);
    }
  };

  const processGateAction = async () => {
    setProcessing(true);
    try {
      const newStatus = gateAction === 'exit' ? 'active' : 'completed';
      await updateOutpassStatus(scannedOutpass._id, newStatus);
      await addLog(scannedOutpass, gateAction);
      await fetchOutpasses();
      setActionDone(true);
    } catch (err) {
      alert(err?.response?.data?.message || 'Gate action failed.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setScannedResult(null);
    setScannedOutpass(null);
    setGateAction(null);
    setActionDone(false);
  };

  const studentsOut   = outpasses.filter(o => o.status === 'active').length;
  const returnedToday = logs.filter(l => l.type === 'entry').length;

  // ─── Action Done screen ───────────────────────────────────────────────────
  if (actionDone && scannedOutpass) {
    const isExit = gateAction === 'exit';
    return (
      <div className="space-y-5 animate-fade-slide-up max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">Gate Security</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.gate} · Scanner Active</p>
        </div>

        <Card className={`flex flex-col items-center py-10 gap-3 ${isExit ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'}`}>
          {isExit
            ? <LogOut size={56} className="text-amber-500 mb-1" />
            : <LogIn size={56} className="text-emerald-500 mb-1" />
          }
          <h2 className={`text-2xl font-extrabold ${isExit ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isExit ? 'Exit Recorded' : 'Entry Recorded'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{scannedOutpass.studentName}</p>
          <p className="text-xs text-slate-400">
            {isExit ? 'Student has left the campus.' : 'Student has returned to campus.'}
          </p>
          <Button variant="primary" fullWidth className="mt-4" onClick={reset}>
            Scan Next
          </Button>
        </Card>
      </div>
    );
  }

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
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5">
            QR not recognized, pass not approved, or pass is pending/rejected.
          </p>
          <Button variant="secondary" fullWidth onClick={reset}>Try Again</Button>
        </Card>

      ) : scannedResult === 'already_done' ? (
        <Card className="flex flex-col items-center py-10 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700">
          <AlertTriangle size={56} className="text-slate-400 mb-3" />
          <h2 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-1">Already Completed</h2>
          {scannedOutpass && (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{scannedOutpass.studentName}</p>
          )}
          <p className="text-xs text-slate-400 text-center mb-5">This outpass has already been used and the student has returned.</p>
          <Button variant="secondary" fullWidth onClick={reset}>Scan Another</Button>
        </Card>

      ) : (
        /* ── Auto-determined action card ── */
        <Card className={`flex flex-col items-center py-8 ${
          gateAction === 'exit'
            ? 'border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-900/10'
            : 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-900/10'
        }`}>

          {/* Action badge */}
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 ${
            gateAction === 'exit'
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            {gateAction === 'exit'
              ? <><LogOut size={14} /> Detected: EXIT — student leaving</>
              : <><LogIn size={14} /> Detected: ENTRY — student returning</>
            }
          </div>

          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
            <CheckCircle size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Access Verified</h2>
          <p className="text-xs font-mono text-slate-400 mb-5">{scannedOutpass._id.slice(-8).toUpperCase()}</p>

          {/* Student detail card */}
          <div className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl divide-y divide-slate-100 dark:divide-slate-700 mb-6 overflow-hidden">
            {/* Name row */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-bold flex items-center justify-center text-lg flex-shrink-0">
                {scannedOutpass.studentName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{scannedOutpass.studentName}</p>
                <p className="text-xs text-slate-400">{scannedOutpass.studentProgram} · {scannedOutpass.studentBatch}</p>
              </div>
            </div>

            {/* Roll No + Reason */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-700">
              <div className="flex items-center gap-2 px-4 py-2.5">
                <Hash size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Roll No</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {scannedOutpass.studentRollNo || '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5">
                <BookOpen size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Reason</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                    {scannedOutpass.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* Hostel + Room */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-700">
              <div className="flex items-center gap-2 px-4 py-2.5">
                <Building2 size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Hostel</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {scannedOutpass.hostel || '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5">
                <Building2 size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Wing / Room</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {scannedOutpass.wing || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile */}
            {scannedOutpass.mobile && (
              <div className="flex items-center gap-2 px-4 py-2.5">
                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Mobile</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{scannedOutpass.mobile}</p>
                </div>
              </div>
            )}
          </div>

          {/* Single smart action button */}
          <div className="w-full flex flex-col gap-2">
            <Button
              size="lg"
              fullWidth
              isLoading={processing}
              className={gateAction === 'exit'
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }
              onClick={processGateAction}
            >
              {gateAction === 'exit' ? <LogOut size={18} /> : <LogIn size={18} />}
              {gateAction === 'exit' ? 'Confirm Exit' : 'Confirm Entry'}
            </Button>
            <Button variant="secondary" size="sm" fullWidth onClick={reset}>
              Cancel
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
                  {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(log.timestamp))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
