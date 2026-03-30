import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

export const WardenApproval = () => {
  const { id } = useParams();
  const { outpasses, updateOutpassStatus } = useApp();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(null);

  const req = outpasses.find(o => o.id === id);

  if (!req) {
    return <div className="text-center" style={{padding: 40}}>Request not found</div>;
  }

  const handleAction = (status) => {
    setActionLoading(status);
    setTimeout(() => {
      updateOutpassStatus(req.id, status);
      setActionLoading(null);
      navigate('/warden');
    }, 1000);
  };

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateStr));
  };

  return (
    <div className="warden-approval-container" style={{display: 'flex', flexDirection: 'column', gap: 20}}>
      <div className="header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8}}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{marginLeft: -8}}>
          <ArrowLeft size={24} />
        </button>
        <span className="text-sm font-semibold text-muted">Review Request</span>
        <div style={{width: 36}}></div>
      </div>

      <Card>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24}}>
          <div className="avatar" style={{width: 56, height: 56, fontSize: '1.5rem'}}>
            {req.studentName.charAt(0)}
          </div>
          <div>
            <h2 className="text-h2" style={{marginBottom: 4}}>{req.studentName}</h2>
            <p className="text-muted text-sm">{req.studentId} • {req.studentProgram} {req.studentBatch}</p>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div>
            <span className="text-xs text-muted">Request ID</span>
            <p className="font-medium">{req.id}</p>
          </div>
          
          <div>
            <span className="text-xs text-muted">Reason</span>
            <p className="font-medium bg-surface-hover" style={{padding: '12px', borderRadius: '8px', marginTop: '4px', border: '1px solid var(--border)'}}>
              {req.reason}
            </p>
          </div>
          
          <div>
            <span className="text-xs text-muted">Duration</span>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'var(--bg)', borderRadius: '8px'}}>
                <Calendar size={16} className="text-muted" />
                <span className="text-sm font-medium">Out: {formatDate(req.dateOut)}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'var(--bg)', borderRadius: '8px'}}>
                <Calendar size={16} className="text-muted" />
                <span className="text-sm font-medium">In: {formatDate(req.dateIn)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {req.status === 'pending' ? (
        <div style={{display: 'flex', gap: 12, marginTop: 8}}>
          <Button 
            variant="danger" 
            fullWidth 
            size="lg"
            onClick={() => handleAction('rejected')}
            isLoading={actionLoading === 'rejected'}
            disabled={actionLoading !== null}
          >
            <XCircle size={18} /> Reject
          </Button>
          <Button 
            variant="primary" 
            fullWidth 
            size="lg"
            style={{backgroundColor: 'var(--success)', color: 'white'}}
            onClick={() => handleAction('approved')}
            isLoading={actionLoading === 'approved'}
            disabled={actionLoading !== null}
          >
            <CheckCircle size={18} /> Approve
          </Button>
        </div>
      ) : (
        <Card style={{textAlign: 'center', backgroundColor: req.status === 'approved' ? 'var(--success-bg)' : 'var(--danger-bg)', borderColor: 'transparent'}}>
          <p className="font-semibold" style={{color: req.status === 'approved' ? 'var(--success-text)' : 'var(--danger-text)'}}>
            This request was {req.status}.
          </p>
        </Card>
      )}
    </div>
  );
};
