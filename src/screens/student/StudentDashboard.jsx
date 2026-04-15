import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Calendar, ArrowRight, Plus, ShieldAlert, FileText } from 'lucide-react';

const statusBadge = (status) => {
  switch (status) {
    case 'approved':  return <Badge variant="success">Approved</Badge>;
    case 'active':    return <Badge variant="info">Out of Campus</Badge>;
    case 'rejected':  return <Badge variant="danger">Rejected</Badge>;
    case 'completed': return <Badge variant="info">Completed</Badge>;
    default:          return <Badge variant="warning">Pending</Badge>;
  }
};

const fmt = d => new Intl.DateTimeFormat('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(d));

export const StudentDashboard = () => {
  const { user, outpasses, loadingOutpasses } = useApp();
  const navigate = useNavigate();

  const approved  = outpasses.filter(o => o.status === 'approved').length;
  const pending   = outpasses.filter(o => o.status === 'pending').length;
  const rejected  = outpasses.filter(o => o.status === 'rejected').length;

  return (
    <div className="space-y-5 animate-fade-slide-up">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          Hello, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono tracking-wide">{user?.rollNo || `${user?.program} · ${user?.batch}`}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-lg flex items-center justify-center shadow-md">
          {user?.name?.charAt(0)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Approved', count:approved, color:'text-emerald-500' },
          { label:'Pending',  count:pending,  color:'text-amber-500' },
          { label:'Rejected', count:rejected, color:'text-red-500' },
        ].map(({ label, count, color }) => (
          <Card key={label} className="p-3 sm:p-4 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-3xl font-extrabold ${color}`}>{count}</p>
          </Card>
        ))}
      </div>

      {/* Apply Banner */}
      <Card className="bg-gradient-to-br from-primary-600 to-primary-800 border-0 text-white p-0 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Need to leave campus?</h3>
              <p className="text-primary-100 text-sm">Apply for your outpass instantly.</p>
            </div>
          </div>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/student/apply')}
            className="bg-white text-primary-700 hover:bg-primary-50 border-0 font-bold"
          >
            <Plus size={18} /> New Request
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => alert('Warden Contact: +91 9876543210')} className="h-11">
          <ShieldAlert size={16} /> Contact Warden
        </Button>
        <Button variant="secondary" onClick={() => alert('1. Must return before 9 PM.\n2. Carry ID Card always.')} className="h-11">
          <FileText size={16} /> Guidelines
        </Button>
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Recent Outpasses</h2>
        {loadingOutpasses ? (
          <Card className="text-center py-10">
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
            </div>
          </Card>
        ) : outpasses.length === 0 ? (
          <Card className="text-center py-10 text-slate-400">No outpasses yet.</Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outpasses.map(op => (
              <Card key={op._id} hoverable onClick={() => navigate(`/student/status/${op._id}`)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">{op.outpassId}</span>
                  {statusBadge(op.status)}
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3 line-clamp-2">{op.reason}</p>
                <div className="flex flex-col gap-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5"><Calendar size={12}/> Out: {fmt(op.dateOut)}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={12}/> In: {fmt(op.dateIn)}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-primary-500 font-semibold mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  View Details <ArrowRight size={12}/>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
