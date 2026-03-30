import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Calendar, ArrowRight, Plus, ShieldAlert, FileText } from 'lucide-react';
import './StudentDashboard.css';

export const StudentDashboard = () => {
  const { user, outpasses } = useApp();
  const navigate = useNavigate();

  const myOutpasses = outpasses.filter(o => o.studentId === user.id);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'active': return <Badge variant="info" style={{backgroundColor: 'var(--primary)', color: 'white'}}>Out of Campus</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'completed': return <Badge variant="info">Completed</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
  };

  const approvedCount = myOutpasses.filter(o => o.status === 'approved').length;
  const pendingCount = myOutpasses.filter(o => o.status === 'pending').length;
  const rejectedCount = myOutpasses.filter(o => o.status === 'rejected').length;

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="text-h2">Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-muted text-sm">{user?.program} {user?.batch}</p>
        </div>
        <div className="avatar">{user?.name.charAt(0)}</div>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <p className="text-xs text-muted">Approved</p>
          <h2 className="text-h2" style={{color: 'var(--success)'}}>{approvedCount}</h2>
        </Card>
        <Card className="stat-card">
          <p className="text-xs text-muted">Pending</p>
          <h2 className="text-h2" style={{color: 'var(--warning)'}}>{pendingCount}</h2>
        </Card>
        <Card className="stat-card">
          <p className="text-xs text-muted">Rejected</p>
          <h2 className="text-h2" style={{color: 'var(--danger)'}}>{rejectedCount}</h2>
        </Card>
      </div>

      <Card className="apply-card">
        <div className="apply-banner">
          <MapPin color="var(--primary-text)" size={24} />
          <div>
            <h3 style={{color: 'var(--primary-text)', marginBottom: 4}}>Need to leave campus?</h3>
            <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem'}}>Apply for your outpass instantly.</p>
          </div>
        </div>
        <Button variant="secondary" fullWidth onClick={() => navigate('/student/apply')}>
          <Plus size={18} /> New Request
        </Button>
      </Card>

      <div className="quick-actions-row">
        <Button variant="secondary" className="action-btn" onClick={() => alert('Warden Contact: +91 9876543210')}>
          <ShieldAlert size={16} /> Contact Warden
        </Button>
        <Button variant="secondary" className="action-btn" onClick={() => alert('1. Must return before 9 PM.\n2. Carry ID Card always.')}>
          <FileText size={16} /> Guidelines
        </Button>
      </div>

      <div className="history-section">
        <h2 className="text-h3" style={{marginBottom: 16}}>Recent Outpasses</h2>
        
        {myOutpasses.length === 0 ? (
          <p className="text-muted text-center" style={{padding: 20}}>No recent outpasses.</p>
        ) : (
          <div className="outpass-list">
            {myOutpasses.map(outpass => (
              <Card 
                key={outpass.id} 
                hoverable 
                className="history-card"
                onClick={() => navigate(`/student/status/${outpass.id}`)}
              >
                <div className="history-card-header">
                  <span className="font-semibold text-sm">{outpass.id}</span>
                  {getStatusBadge(outpass.status)}
                </div>
                
                <h4 className="text-body font-medium" style={{marginBottom: 12}}>{outpass.reason}</h4>
                
                <div className="history-card-details">
                  <div className="detail-row text-xs text-muted">
                    <Calendar size={14} />
                    <span>Out: {formatDate(outpass.dateOut)}</span>
                  </div>
                  <div className="detail-row text-xs text-muted">
                    <Calendar size={14} />
                    <span>In: {formatDate(outpass.dateIn)}</span>
                  </div>
                </div>
                
                <div className="history-card-footer text-xs text-muted">
                  View Details <ArrowRight size={14} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
