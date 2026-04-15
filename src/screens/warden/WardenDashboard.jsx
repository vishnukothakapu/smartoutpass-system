import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Clock, ChevronRight } from 'lucide-react';

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

const FILTERS = [
  { label: 'Pending',  value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'All',      value: 'all' },
];

export const WardenDashboard = () => {
  const { user, outpasses, loadingOutpasses } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending');

  if (!user || user.role !== 'warden') return null;

  const filtered = outpasses.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.studentName.toLowerCase().includes(q) || o._id.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  const pending   = outpasses.filter(o => o.status === 'pending').length;
  const active    = outpasses.filter(o => o.status === 'active' || o.status === 'approved').length;
  const completed = outpasses.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-5 animate-fade-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">Warden Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{[user.hostel, user.wing].filter(Boolean).join(' - ')}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold text-lg flex items-center justify-center">W</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Pending',  count:pending,   color:'text-amber-500' },
          { label:'Active',   count:active,    color:'text-emerald-500' },
          { label:'Returned', count:completed, color:'text-primary-500' },
        ].map(({ label, count, color }) => (
          <Card key={label} className="p-3 sm:p-4 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-3xl font-extrabold ${color}`}>{count}</p>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex-shrink-0">
          {FILTERS.map(({ label, value }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === value ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      {loadingOutpasses ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Clock size={44} className="opacity-30 mb-3" />
          <p className="font-semibold">No {filter} requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map(req => (
            <Card key={req._id} hoverable onClick={() => navigate(`/warden/request/${req._id}`)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{req.studentName}</h3>
                  <p className="text-xs text-slate-400 font-mono tracking-wide">{req.outpassId} · {req.studentRollNo || `${req.studentProgram} ${req.studentBatch}`}</p>
                </div>
                {statusBadge(req.status)}
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2 my-2">{req.reason}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-400">Out: {fmt(req.dateOut)}</span>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
