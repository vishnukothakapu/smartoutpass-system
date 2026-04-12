import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../App';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Ticket } from 'lucide-react';

export const LoginScreen = () => {
  const { login, googleLogin } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ role: 'student', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const userData = await login(formData.role, formData.email, formData.password);
      navigate(`/${userData.role}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (response) => {
    setError(''); setLoading(true);
    try {
      const userData = await googleLogin(response.credential);
      navigate(`/${userData.role}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Use your @iiitm.ac.in college email to sign in.');
    } finally { setLoading(false); }
  };

  const isStudent = formData.role === 'student';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center shadow-md mb-4">
          <Ticket size={32} className="text-primary-500" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">SmartPass</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Seamless Hostel Outpass System</p>
      </div>

      {/* Card */}
      <Card className="w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-5">Sign In</h2>

        <Select
          label="Select Role"
          value={formData.role}
          onChange={e => { setError(''); setFormData({ role: e.target.value, email: '', password: '' }); }}
          options={[
            { label: 'Student', value: 'student' },
            { label: 'Warden', value: 'warden' },
            { label: 'Security Guard', value: 'security' },
          ]}
          className="mb-5"
        />

        {/* ── Student: Google Sign-In ── */}
        {isStudent ? (
          <div className="flex flex-col items-center gap-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              Sign in with your <span className="font-semibold text-primary-600 dark:text-primary-400">@iiitm.ac.in</span> Google account.<br />
              Your name, branch, batch & year are auto-filled from your email.
            </p>

            {loading ? (
              <div className="flex items-center gap-3 py-3">
                <svg className="animate-spin h-5 w-5 text-primary-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                <span className="text-sm text-slate-500">Signing you in...</span>
              </div>
            ) : (
              <div className="flex justify-center w-full transition-transform hover:-translate-y-1 hover:shadow-lg rounded-[20px] active:scale-95 duration-200">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in cancelled or failed.')}
                  theme="outline" 
                  shape="pill"
                  size="large" 
                  text="continue_with" 
                  logo_alignment="center"
                  width="320"
                  hosted_domain="iiitm.ac.in"
                />
              </div>
            )}

            {/* Email format hint */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Email format</p>
              <code className="text-xs text-primary-600 dark:text-primary-400 font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                img_2023028@iiitm.ac.in
              </code>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[['Branch','IMG'],['Batch','2023'],['Year','3rd']].map(([k,v])=> (
                  <div key={k} className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide">{k}</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Staff: Email + Password ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input type="email" label="Email ID" placeholder="Enter your email"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <Input type="password" label="Password" placeholder="Enter your password"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <Button type="submit" fullWidth size="lg" isLoading={loading} className="mt-2">
              Secure Login
            </Button>
          </form>
        )}

        {error && (
          <div className="mt-4 text-xs text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}
      </Card>

      <p className="mt-8 text-xs text-slate-400">Authorized Access Only.</p>
    </div>
  );
};
