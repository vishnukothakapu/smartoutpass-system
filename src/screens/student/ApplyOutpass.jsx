import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import './ApplyOutpass.css';

export const ApplyOutpass = () => {
  const { user, addOutpass } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    reasonStr: '',
    items: '',
    dateOut: '',
    dateIn: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dOut = new Date(formData.dateOut);
    const dIn = new Date(formData.dateIn);
    
    if (dOut < new Date()) {
      alert("Departure date cannot be in the past.");
      return;
    }
    
    if (dIn <= dOut) {
      alert("Return date must be strictly after the departure date.");
      return;
    }

    setLoading(true);

    // Simulate network delay for micro-interaction
    setTimeout(() => {
      const id = addOutpass({
        reason: formData.reasonStr,
        items: formData.items,
        dateOut: formData.dateOut,
        dateIn: formData.dateIn
      });
      setLoading(false);
      setSuccess(true);

      // Navigate to status after showing success state
      setTimeout(() => {
        navigate(`/student/status/${id}`);
      }, 1500);
    }, 1200);
  };

  if (success) {
    return (
      <div className="apply-container success-state">
        <div className="success-icon-wrapper">
          <CheckCircle className="success-icon" size={64} />
        </div>
        <h2 className="text-h2" style={{ marginTop: 24, marginBottom: 8 }}>Application Submitted</h2>
        <p className="text-muted text-center text-body">
          Your outpass request has been sent to the warden for approval.
        </p>
      </div>
    );
  }

  return (
    <div className="apply-container">
      <div className="header-row">
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginLeft: -8 }}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-h2" style={{ marginBottom: 0 }}>Apply Outpass</h1>
        <div style={{ width: 36 }}></div> {/* Layout spacer */}
      </div>

      <Card style={{ marginBottom: '0px', backgroundColor: 'var(--surface-hover)', padding: '16px' }}>
        <h3 className="text-sm font-semibold text-muted" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>Profile Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
          <div><span className="text-muted text-xs">Name</span> <br /> <strong className="font-medium">{user.name}</strong></div>
          <div><span className="text-muted text-xs">Program & Year</span> <br /> <strong className="font-medium">{user.program}-{user.batch} ({user.year})</strong></div>
          <div><span className="text-muted text-xs">Hostel & Room</span> <br /> <strong className="font-medium">{user.hostel} - {user.room}</strong></div>
          <div><span className="text-muted text-xs">Mobile Number</span> <br /> <strong className="font-medium">{user.mobile}</strong></div>
          <div><span className="text-muted text-xs">Father's Name</span> <br /> <strong className="font-medium">{user.fatherName}</strong></div>
          <div><span className="text-muted text-xs">Father's Mobile</span> <br /> <strong className="font-medium">{user.fatherMobile}</strong></div>
        </div>
      </Card>

      <Card className="apply-form-card">
        <form onSubmit={handleSubmit}>
          <Input
            label="Reason for leave"
            placeholder="E.g., Going home for weekend"
            value={formData.reasonStr}
            onChange={e => setFormData({ ...formData, reasonStr: e.target.value })}
            required
          />

          <Input
            label="Items taking out"
            placeholder="E.g., Laptop, Bags, etc."
            value={formData.items}
            onChange={e => setFormData({ ...formData, items: e.target.value })}
          />

          <div className="date-row">
            <Input
              type="datetime-local"
              label="Date & Time Out"
              value={formData.dateOut}
              onChange={e => setFormData({ ...formData, dateOut: e.target.value })}
              required
            />
            <Input
              type="datetime-local"
              label="Date & Time In"
              value={formData.dateIn}
              onChange={e => setFormData({ ...formData, dateIn: e.target.value })}
              required
            />
          </div>

          <div style={{ marginTop: 32 }}>
            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
