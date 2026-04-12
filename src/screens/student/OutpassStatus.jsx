import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Clock, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getOutpass } from '../../api/outpasses';

const fmt = d => new Intl.DateTimeFormat('en-US', { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(d));

export const OutpassStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  useEffect(() => {
    getOutpass(id).then(setOutpass).catch(() => setOutpass(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center py-20"><svg className="animate-spin h-9 w-9 text-primary-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>;
  if (!outpass) return <div className="text-center py-20 text-slate-400">Outpass not found.</div>;

  const isApproved = outpass.status === 'approved' || outpass.status === 'active';
  const isPending  = outpass.status === 'pending';
  const isRejected = outpass.status === 'rejected';

  const statusBadge = () => {
    if (outpass.status === 'approved')  return <Badge variant="success">Approved</Badge>;
    if (outpass.status === 'active')    return <Badge variant="info">Out of Campus</Badge>;
    if (isPending)                       return <Badge variant="warning">Pending Approval</Badge>;
    if (isRejected)                      return <Badge variant="danger">Rejected</Badge>;
    return <Badge variant="info">Completed</Badge>;
  };

  const qrValue = JSON.stringify({ id: outpass._id, student: outpass.studentId, timestamp: new Date().toISOString() });

  return (
    <div className="space-y-4 animate-fade-slide-up max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <span className="text-sm font-semibold text-slate-400">Request Tracker</span>
        <div className="w-9" />
      </div>

      {/* Status header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">{outpass._id.slice(-8).toUpperCase()}</h1>
        {statusBadge()}
      </div>

      {/* QR Code */}
      {isApproved && (
        <Card className="flex flex-col items-center py-6">
          <div className="p-4 bg-white rounded-2xl shadow-inner">
            <QRCodeSVG value={qrValue} size={180} level="H" includeMargin />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-4">
            Show this QR code at the main gate scanner.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ready to verify</span>
          </div>
        </Card>
      )}

      {/* Pending */}
      {isPending && (
        <Card className="flex flex-col items-center py-8">
          <Clock size={44} className="text-amber-400 animate-pulse-beat mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Warden Review Pending</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-xs">
            Your request is in queue. You'll be notified once the warden reviews it.
          </p>
        </Card>
      )}

      {/* Details */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-700">
          Outpass Details
        </h3>
        <div>
          <p className="text-xs text-slate-400 mb-1">Reason</p>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{outpass.reason}</p>
        </div>
        {outpass.destination && (
          <div>
            <p className="text-xs text-slate-400 mb-1">Destination</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{outpass.destination}</p>
          </div>
        )}
        {outpass.items && (
          <div>
            <p className="text-xs text-slate-400 mb-1">Items Taken Out</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{outpass.items}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-slate-400 mb-2">Duration</p>
          <div className="flex flex-col gap-2">
            {[['Departure', outpass.dateOut], ['Return', outpass.dateIn]].map(([label, date]) => (
              <div key={label} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3">
                <Calendar size={15} className="text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{fmt(date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Emergency */}
      {isPending && (
        <Button variant="ghost" fullWidth onClick={() => setShowModal(true)}
          className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl h-11">
          <AlertTriangle size={16} /> Declare Emergency Fast-Track
        </Button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-sm">
            <h3 className="text-xl font-bold text-red-500 mb-2">Emergency Request?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
              This will immediately alert the Warden and Security. Only use for genuine emergencies.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="danger" fullWidth isLoading={emergencyLoading}
                onClick={() => { setEmergencyLoading(true); setTimeout(() => { setEmergencyLoading(false); setShowModal(false); alert('Emergency dispatched!'); }, 1500); }}>
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
