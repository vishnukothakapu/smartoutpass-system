import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Clock, LogIn, LogOut } from 'lucide-react';
import { getLogs } from '../../api/logs';

const fmt = d => new Intl.DateTimeFormat('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(d));

export const SecurityLog = () => {
  const navigate = useNavigate();
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs().then(setLogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 animate-fade-slide-up max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Gate History Log</h1>
        <div className="w-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="animate-spin h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Clock size={48} className="opacity-30 mb-3" />
          <p className="font-semibold">No gate logs recorded yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map(log => (
            <Card key={log._id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${log.type === 'entry' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {log.type === 'entry' ? <LogIn size={20} /> : <LogOut size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{log.studentName}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    {log.type} · {log.outpassId?.toString().slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 flex-shrink-0">{fmt(log.timestamp)}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
