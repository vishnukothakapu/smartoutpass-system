import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import {
  ArrowLeft, Clock, LogIn, LogOut, Hash, Building2, Phone,
  BookOpen, ChevronDown, ChevronUp, Search,
} from 'lucide-react';
import { getLogs } from '../../api/logs';

const fmt = d =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(d));

const LogCard = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const isEntry = log.type === 'entry';

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        isEntry
          ? 'border-emerald-200 dark:border-emerald-800'
          : 'border-amber-200 dark:border-amber-800'
      }`}
    >
      {/* Main row — always visible */}
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setExpanded(v => !v)}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isEntry
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
          }`}
        >
          {isEntry ? <LogIn size={20} /> : <LogOut size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {log.studentName}
            </h4>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                isEntry
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}
            >
              {isEntry ? 'ENTRY' : 'EXIT'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {log.studentRollNo ? `${log.studentRollNo} · ` : ''}
            ID: {log.outpassId?.toString().slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs font-medium text-slate-400">{fmt(log.timestamp)}</span>
          {expanded ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 grid grid-cols-2 gap-3 text-xs">
          {/* Outpass ID */}
          <div className="col-span-2 flex items-center gap-2">
            <Hash size={12} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Outpass ID</p>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {log.outpassId?.toString()}
              </p>
            </div>
          </div>

          {/* Roll No */}
          <div className="flex items-center gap-2">
            <Hash size={12} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Roll No</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {log.studentRollNo || '—'}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="flex items-center gap-2">
            <BookOpen size={12} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Reason</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {log.reason || '—'}
              </p>
            </div>
          </div>

          {/* Hostel */}
          <div className="flex items-center gap-2">
            <Building2 size={12} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Hostel</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {log.hostel || '—'}
              </p>
            </div>
          </div>

          {/* Room / Wing */}
          <div className="flex items-center gap-2">
            <Building2 size={12} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Wing / Room</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {log.room || '—'}
              </p>
            </div>
          </div>

          {/* Mobile */}
          <div className="col-span-2 flex items-center gap-2">
            <Phone size={12} className="text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Mobile</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {log.mobile || '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export const SecurityLog = () => {
  const navigate = useNavigate();
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    getLogs().then(setLogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    return (
      l.studentName?.toLowerCase().includes(q) ||
      l.studentRollNo?.toLowerCase().includes(q) ||
      l.hostel?.toLowerCase().includes(q) ||
      l.reason?.toLowerCase().includes(q) ||
      l.outpassId?.toString().toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 animate-fade-slide-up max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Gate History Log</h1>
          {!loading && (
            <p className="text-xs text-slate-400 mt-0.5">{logs.length} total records</p>
          )}
        </div>
        <div className="w-9" />
      </div>

      {/* Search */}
      {!loading && logs.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll no, hostel…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 transition"
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="animate-spin h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Clock size={48} className="opacity-30 mb-3" />
          <p className="font-semibold">
            {logs.length === 0 ? 'No gate logs recorded yet.' : 'No results match your search.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(log => (
            <LogCard key={log._id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};
