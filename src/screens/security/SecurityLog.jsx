import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Clock, LogIn, LogOut } from 'lucide-react';

export const SecurityLog = () => {
  const { logs } = useApp();
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
  };

  return (
    <div className="security-log" style={{display: 'flex', flexDirection: 'column', gap: 20}}>
      <div className="header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8}}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{marginLeft: -8}}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-h2" style={{margin: 0}}>Gate History Log</h1>
        <div style={{width: 36}}></div>
      </div>

      {logs.length === 0 ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center'}}>
          <Clock size={48} className="text-muted" style={{opacity: 0.5, marginBottom: 16}} />
          <p className="text-h3 text-muted">No gate logs recorded yet.</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {logs.map(log => (
            <Card key={log.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <div style={{
                  width: 40, height: 40, borderRadius: '12px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: log.type === 'entry' ? 'var(--success-bg)' : 'var(--bg)',
                  color: log.type === 'entry' ? 'var(--success-text)' : 'var(--text-main)'
                }}>
                  {log.type === 'entry' ? <LogIn size={20} /> : <LogOut size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold">{log.studentName}</h4>
                  <p className="text-xs text-muted" style={{textTransform: 'uppercase'}}>{log.type} • {log.outpassId}</p>
                </div>
              </div>
              <div className="text-xs font-medium text-muted">
                {formatDate(log.timestamp)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
