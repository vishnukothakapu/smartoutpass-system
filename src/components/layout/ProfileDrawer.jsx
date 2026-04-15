import React, { useState, useEffect } from 'react';
import { X, Lock, User, Edit3, CheckCircle, Loader, GraduationCap, CalendarDays, School, Home, DoorOpen, Smartphone, Phone, Mail, Building2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { updateProfile } from '../../api/profile';

const LOCKED = [
  { key: 'name',    label: 'Full Name', Icon: User },
  { key: 'rollNo',  label: 'Roll No',   Icon: GraduationCap },
  { key: 'program', label: 'Branch',    Icon: GraduationCap },
  { key: 'batch',   label: 'Batch',     Icon: CalendarDays },
  { key: 'year',    label: 'Year',      Icon: School },
];

const EDITABLE = [
  { key: 'hostel',       label: 'Hostel',          placeholder: 'e.g. Satpura',    Icon: Building2 },
  { key: 'wing',         label: 'Wing',            placeholder: 'e.g. BH-4',       Icon: Home },
  { key: 'room',         label: 'Room Number',     placeholder: 'e.g. 102',         Icon: DoorOpen },
  { key: 'mobile',       label: 'Mobile',          placeholder: '+91 9876543210',   Icon: Smartphone },
  { key: 'fatherName',   label: "Father's Name",   placeholder: 'e.g. Mr. Ramesh', Icon: User },
  { key: 'fatherMobile', label: "Father's Mobile", placeholder: '+91 9876543100',   Icon: Phone },
];

const ROLE_META = {
  student:  { Icon: GraduationCap, label: 'Student' },
  warden:   { Icon: ShieldCheck,    label: 'Warden' },
  security: { Icon: Lock,           label: 'Security' },
};

export const ProfileDrawer = ({ user, onClose, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');
  const [form, setForm] = useState({
    hostel: '', wing: '', room: '', mobile: '', fatherName: '', fatherMobile: '',
  });

  useEffect(() => {
    if (user) setForm({
      hostel:       user.hostel       || '',
      wing:         user.wing         || '',
      room:         user.room         || '',
      mobile:       user.mobile       || '',
      fatherName:   user.fatherName   || '',
      fatherMobile: user.fatherMobile || '',
    });
  }, [user]);

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      const { user: updated } = await updateProfile(form);
      onUpdate(updated);
      setSuccess(true); setEditing(false);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save changes.');
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    setEditing(false); setError('');
    setForm({
      hostel:       user?.hostel       || '',
      wing:         user?.wing         || '',
      room:         user?.room         || '',
      mobile:       user?.mobile       || '',
      fatherName:   user?.fatherName   || '',
      fatherMobile: user?.fatherMobile || '',
    });
  };

  const isStudent = user?.role === 'student';
  const role      = ROLE_META[user?.role] || ROLE_META.student;
  const RoleIcon  = role.Icon;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in" onClick={onClose} />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-[101] flex flex-col animate-slide-in-right overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-5 bg-gradient-to-br from-blue-600 to-blue-800 flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base leading-tight truncate">{user?.name}</h2>
            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold bg-white/20 text-white/90 px-2.5 py-0.5 rounded-full">
              <RoleIcon size={11} />
              {role.label}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Academic Info — locked */}
          {isStudent && (
            <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                <Lock size={12} />
                Academic Info
                <span className="ml-1 text-[10px] normal-case tracking-normal font-normal bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">read-only</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {LOCKED.map(({ key, label, Icon }) => user?.[key] ? (
                  <div key={key} className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={14} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user[key]}</p>
                    </div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {/* Editable fields */}
          {isStudent && (
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <User size={12} /> Contact & Hostel
                </div>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 px-3 py-1.5 rounded-full transition-colors">
                    <Edit3 size={12} /> Edit
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {EDITABLE.map(({ key, label, placeholder, Icon }) => (
                  <div key={key}>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                      <Icon size={12} className="text-slate-400" />
                      {label}
                    </label>
                    {editing ? (
                      <input
                        value={form[key]}
                        placeholder={placeholder}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 py-1">
                        {user?.[key] || <span className="text-slate-400 italic">Not set</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-4 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">{error}</p>
              )}
              {success && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2">
                  <CheckCircle size={14} /> Profile updated successfully!
                </div>
              )}

              {editing && (
                <div className="flex gap-3 mt-5">
                  <button onClick={handleCancel} disabled={saving} className="flex-1 h-11 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 h-11 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                    {saving ? <><Loader size={14} className="animate-spin" /> Saving...</> : <><CheckCircle size={14} /> Save Changes</>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Non-student info */}
          {!isStudent && (
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                <User size={12} /> Details
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { Icon: Mail,        label: 'Email', value: user?.email },
                  user?.hostel ? { Icon: Building2,  label: 'Hostel', value: user.hostel } : null,
                  user?.wing   ? { Icon: Home,       label: 'Wing',   value: user.wing   } : null,
                  user?.gate   ? { Icon: ShieldAlert, label: 'Gate',  value: user.gate  } : null,
                ].filter(Boolean).map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 border border-slate-100 dark:border-slate-700">
                    <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
