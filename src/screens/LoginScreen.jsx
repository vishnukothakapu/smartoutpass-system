import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { User, ShieldUser, LocateFixed } from 'lucide-react';
import './LoginScreen.css';

export const LoginScreen = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: 'student',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // College Email Validation for Students


    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      login(formData.role, formData.email);
      navigate(`/${formData.role}`);
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo-container">
          <span className="login-logo">🎟️</span>
        </div>
        <h1 className="text-h1">SmartPass</h1>
        <p className="text-muted text-center" style={{ marginTop: 8 }}>
          Seamless Hostel Outpass System
        </p>
      </div>

      <Card className="login-card">
        <h2 className="text-h3" style={{ marginBottom: '20px', textAlign: 'center' }}>Sign In</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Select
            label="Select Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { label: 'Student', value: 'student' },
              { label: 'Warden', value: 'warden' },
              { label: 'Security Guard', value: 'security' }
            ]}
          />

          <Input
            type="email"
            label={formData.role === 'student' ? "College Email ID" : "Email ID"}
            placeholder={formData.role === 'student' ? "e.g. img_2023028@iiitm.ac.in" : "Enter your email"}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            error={error ? true : false}
          />
          {formData.role === 'student' && (
            <p className="text-xs text-muted" style={{ marginTop: '-12px', marginBottom: '8px' }}>
              Note: Use your college email id
            </p>
          )}

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <div className="text-xs text-center" style={{ color: 'var(--danger)', marginBottom: '8px' }}>{error}</div>}

          <div style={{ marginTop: 16 }}>
            <Button type="submit" fullWidth isLoading={loading}>
              Secure Login
            </Button>
          </div>
        </form>
      </Card>

      <p className="text-xs text-muted text-center" style={{ marginTop: '32px' }}>
        Authorized Access Only.
      </p>
    </div>
  );
};
