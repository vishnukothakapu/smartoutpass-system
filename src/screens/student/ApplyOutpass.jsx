import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { isProfileComplete } from '../../utils/profileUtils';

export const ApplyOutpass = () => {
  const { user, addOutpass, outpasses } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const profileComplete = isProfileComplete(user);
  const hasActiveOutpass = outpasses.some(o => ['pending', 'approved', 'active'].includes(o.status));
  const minDateTime = new Date().toISOString().slice(0, 16);
  const [formData, setFormData] = useState({ reasonStr: '', destination: '', items: '', dateOut: '', dateIn: '' });

  const calculateDuration = () => {
    if (!formData.dateOut || !formData.dateIn) return null;
    const start = new Date(formData.dateOut);
    const end = new Date(formData.dateIn);
    if (end <= start) return null;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const duration = calculateDuration();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (new Date(formData.dateIn) <= new Date(formData.dateOut)) {
      setError('Return date must be after the departure date.'); return;
    }
    setLoading(true);
    try {
      const id = await addOutpass({ reason: formData.reasonStr, destination: formData.destination, items: formData.items, dateOut: formData.dateOut, dateIn: formData.dateIn });
      setSuccess(true);
      setTimeout(() => navigate(`/student/status/${id}`), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 animate-fade-slide-up">
      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <CheckCircle size={44} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Submitted!</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center text-sm max-w-xs">
        Your outpass request has been sent to the warden for approval.
      </p>
    </div>
  );

  if (hasActiveOutpass) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 animate-fade-slide-up px-4">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <XCircle size={44} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white text-center">Action Blocked</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center text-sm max-w-sm">
        You already have an ongoing outpass. You cannot apply for a new one until your current outpass is completed or rejected.
      </p>
      <Button onClick={() => navigate(-1)} variant="secondary" className="mt-4">
        Go Back
      </Button>
    </div>
  );
  
  if (!profileComplete) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 animate-fade-slide-up px-4">
      <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <AlertTriangle size={44} className="text-amber-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white text-center">Profile Incomplete</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center text-sm max-w-sm">
        You must fill in your hostel details and contact info before you can apply for an outpass. 
        Please update your profile details first.
      </p>
      <div className="flex gap-3 mt-4">
        <Button onClick={() => navigate(-1)} variant="secondary">
          Go Back
        </Button>
        <button 
          onClick={() => navigate('/student')} 
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Update Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-slide-up max-w-2xl mx-auto">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Apply Outpass</h1>
        <div className="w-9" />
      </div>

      {/* Profile summary */}
      <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
          Your Details
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label:'Name',           value: user.name },
            { label:'Roll No & Year', value: `${user.rollNo || user.program + '-' + user.batch} (${user.year})` },
            { label:'Hostel & Room',  value: `${user.hostel || '—'} - ${user.room || '—'}` },
            { label:'Mobile',         value: user.mobile || '—' },
            { label:"Father's Name",  value: user.fatherName || '—' },
            { label:"Father's Mobile",value: user.fatherMobile || '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Reason for leave" placeholder="E.g., Going home for weekend"
            value={formData.reasonStr} onChange={e => setFormData({ ...formData, reasonStr: e.target.value })} required />
          <Input label="Destination Address" placeholder="E.g., 123 Main St, New Delhi, Delhi 110001"
            value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} required />
          <Input label="Items taking out (optional)" placeholder="E.g., Laptop, Bags, etc."
            value={formData.items} onChange={e => setFormData({ ...formData, items: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input type="datetime-local" label="Date & Time Out"
              value={formData.dateOut} min={minDateTime}
              onChange={e => setFormData({ ...formData, dateOut: e.target.value })} required />
            <Input type="datetime-local" label="Date & Time In (Return)"
              value={formData.dateIn} min={minDateTime}
              onChange={e => setFormData({ ...formData, dateIn: e.target.value })} required />
          </div>

          {duration && (
            <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 p-3 rounded-xl border border-primary-200 dark:border-primary-800 flex items-center justify-between">
              <span className="text-sm font-semibold">Total Duration</span>
              <span className="text-sm font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded-lg shadow-sm">
                {duration} {duration === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          )}

          {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">{error}</p>}

          <Button type="submit" fullWidth size="lg" isLoading={loading} className="mt-2">
            Submit Application
          </Button>
        </form>
      </Card>
    </div>
  );
};
