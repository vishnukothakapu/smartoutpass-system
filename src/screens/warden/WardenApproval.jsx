import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getOutpass } from '../../api/outpasses';

const fmt = d => new Intl.DateTimeFormat('en-US', { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(d));

export const WardenApproval = () => {
  const { id } = useParams();
  const { updateOutpassStatus } = useApp();
  const navigate = useNavigate();
  const [req, setReq]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError]   = useState('');

  useEffect(() => {
    const fetchIt = () => getOutpass(id).then(setReq).catch(() => setReq(null)).finally(() => setLoading(false));
    fetchIt();
    const interval = setInterval(fetchIt, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const handleAction = async (status) => {
    setError(''); setActionLoading(status);
    try {
      const updated = await updateOutpassStatus(req._id, status);
      setReq(updated);
      setTimeout(() => navigate('/warden'), 800);
    } catch (err) {
      setError(err?.response?.data?.message || 'Action failed. Please try again.');
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><svg className="animate-spin h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>;
  if (!req) return <div className="text-center py-20 text-slate-400">Request not found.</div>;

  return (
    <div className="space-y-5 animate-fade-slide-up max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <span className="text-sm font-semibold text-slate-400">Review Request</span>
        <div className="w-9" />
      </div>

      {/* Student card */}
      <Card>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-2xl flex items-center justify-center flex-shrink-0">
            {req.studentName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{req.studentName}</h2>
            <p className="text-sm text-slate-400 font-mono tracking-wide">{req.studentRollNo || `${req.studentProgram} ${req.studentBatch}`} · {req.outpassId}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Reason</p>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.reason}</p>
            </div>
          </div>
          {req.destination && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Destination Address</p>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.destination}</p>
              </div>
            </div>
          )}
          {req.items && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Items Taking Out</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.items}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Duration</p>
            <div className="space-y-2">
              {[['Departure', req.dateOut], ['Return', req.dateIn]].map(([label, date]) => (
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
        </div>
      </Card>

      {error && <p className="text-xs text-center text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">{error}</p>}

      {/* Actions */}
      {req.status === 'pending' ? (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="danger" size="lg" fullWidth
            onClick={() => handleAction('rejected')}
            isLoading={actionLoading === 'rejected'}
            disabled={actionLoading !== null}>
            <XCircle size={18} /> Reject
          </Button>
          <Button size="lg" fullWidth
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => handleAction('approved')}
            isLoading={actionLoading === 'approved'}
            disabled={actionLoading !== null}>
            <CheckCircle size={18} /> Approve
          </Button>
        </div>
      ) : (
        <Card className={req.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}>
          <p className={`font-semibold text-center ${req.status === 'approved' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            This request was {req.status}.
          </p>
        </Card>
      )}
    </div>
  );
};
