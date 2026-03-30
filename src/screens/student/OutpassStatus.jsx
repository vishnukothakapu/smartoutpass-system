import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Clock, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import './OutpassStatus.css';

export const OutpassStatus = () => {
  const { id } = useParams();
  const { outpasses } = useApp();
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  const outpass = outpasses.find(o => o.id === id);

  if (!outpass) {
    return <div className="text-center" style={{padding: 40}}>Outpass not found</div>;
  }

  const isApproved = outpass.status === 'approved' || outpass.status === 'active';
  const isPending = outpass.status === 'pending';
  const isRejected = outpass.status === 'rejected';

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateStr));
  };

  const handleEmergency = () => {
    setEmergencyLoading(true);
    setTimeout(() => {
      setEmergencyLoading(false);
      setShowEmergencyModal(false);
      alert("Emergency request dispatched to Warden & Security immediately. Please proceed to the gate.");
    }, 1500);
  };

  return (
    <div className="status-container">
      <div className="header-row">
        <button className="icon-btn" onClick={() => navigate(-1)} style={{marginLeft: -8}}>
          <ArrowLeft size={24} />
        </button>
        <span className="text-sm font-semibold text-muted">Request Tracker</span>
        <div style={{width: 36}}></div>
      </div>

      <div className="status-header">
        <h1 className="text-h1">{outpass.id}</h1>
        {outpass.status === 'approved' && <Badge variant="success">Approved</Badge>}
        {outpass.status === 'active' && <Badge variant="info" style={{backgroundColor: 'var(--primary)', color: 'white'}}>Out of Campus</Badge>}
        {isPending && <Badge variant="warning">Pending Approval</Badge>}
        {isRejected && <Badge variant="danger">Rejected</Badge>}
        {(outpass.status === 'completed') && <Badge variant="info">Completed</Badge>}
      </div>

      {isApproved && outpass.qrData && (
        <Card className="qr-card">
          <div className="qr-wrapper">
            <QRCodeSVG value={outpass.qrData} size={200} level="H" includeMargin={true} />
          </div>
          <p className="text-muted text-center text-sm" style={{marginTop: 16}}>
            Show this QR code at the main gate scanner.
          </p>
          <div className="scan-instruction">
            <ShieldCheck size={16} color="var(--success)" />
            <span className="text-xs font-medium" style={{color: 'var(--success)'}}>Ready to verify</span>
          </div>
        </Card>
      )}

      {isPending && (
        <Card className="pending-card">
          <Clock size={40} className="pulse-loading" style={{color: 'var(--warning)', marginBottom: 16}} />
          <h3 className="text-h3" style={{marginBottom: 8}}>Warden Review Pending</h3>
          <p className="text-muted text-sm text-center">
            Your request is currently in queue. You will be notified once the warden reviews your request.
          </p>
        </Card>
      )}

      <Card className="details-card">
        <h3 className="text-h3" style={{marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12}}>Outpass Details</h3>
        
        <div className="detail-item">
          <span className="text-xs text-muted">Reason</span>
          <p className="font-medium">{outpass.reason}</p>
        </div>
        
        <div className="detail-item">
          <span className="text-xs text-muted">Leave Duration</span>
          <div className="duration-pill">
            <Calendar size={14} className="text-muted" />
            <span className="text-sm font-medium">{formatDate(outpass.dateOut)}</span>
          </div>
          <div className="vertical-line"></div>
          <div className="duration-pill">
            <Calendar size={14} className="text-muted" />
            <span className="text-sm font-medium">{formatDate(outpass.dateIn)}</span>
          </div>
        </div>
      </Card>

      {isPending && (
        <div className="emergency-section">
          <Button variant="ghost" className="emergency-btn" onClick={() => setShowEmergencyModal(true)}>
            <AlertTriangle size={18} />
             Declare Emergency Fast-Track
          </Button>
        </div>
      )}

      {/* Basic Modal for Emergency */}
      {showEmergencyModal && (
        <div className="modal-overlay">
          <Card className="modal-content">
            <h3 className="text-h2" style={{color: 'var(--danger)', marginBottom: 8}}>Emergency Request?</h3>
            <p className="text-body text-muted" style={{marginBottom: 24}}>
              This will bypass standard queues and immediately alert the Warden and Security on duty. Only use this for genuine emergencies.
            </p>
            <div style={{display: 'flex', gap: 12}}>
              <Button variant="secondary" fullWidth onClick={() => setShowEmergencyModal(false)}>Cancel</Button>
              <Button variant="danger" fullWidth onClick={handleEmergency} isLoading={emergencyLoading}>Confirm</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
