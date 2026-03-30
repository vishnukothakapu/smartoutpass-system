import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import './WardenDashboard.css';

export const WardenDashboard = () => {
  const { user, outpasses } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('pending'); // all, pending, approved, rejected

  if (!user || user.role !== 'warden') return null;

  const filteredOutpasses = outpasses.filter(o => {
    const matchesSearch = o.studentName.toLowerCase().includes(search.toLowerCase()) || 
                          o.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : o.status === filter;
    return matchesSearch && matchesFilter;
  });

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

  const pendingCount = outpasses.filter(o => o.status === 'pending').length;
  const activeCount = outpasses.filter(o => o.status === 'active' || o.status === 'approved').length;
  const completedCount = outpasses.filter(o => o.status === 'completed').length;

  return (
    <div className="warden-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="text-h2">Warden Portal</h1>
          <p className="text-muted text-sm">{user.hostel} Block Requests</p>
        </div>
        <div className="avatar warden-avatar">W</div>
      </div>

      <div className="stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
        <Card className="stat-card" style={{padding: '12px', textAlign: 'center'}}>
          <p className="text-xs text-muted">Pending</p>
          <h2 className="text-h2" style={{color: 'var(--warning)'}}>{pendingCount}</h2>
        </Card>
        <Card className="stat-card" style={{padding: '12px', textAlign: 'center'}}>
          <p className="text-xs text-muted">Active (Out/Approved)</p>
          <h2 className="text-h2" style={{color: 'var(--success)'}}>{activeCount}</h2>
        </Card>
        <Card className="stat-card" style={{padding: '12px', textAlign: 'center'}}>
          <p className="text-xs text-muted">Returned</p>
          <h2 className="text-h2" style={{color: 'var(--primary)'}}>{completedCount}</h2>
        </Card>
      </div>

      <Card style={{backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-4px'}}>
        <div style={{color: 'var(--danger)'}}><AlertTriangle size={20} /></div>
        <p className="text-sm font-medium" style={{color: 'var(--danger-text)'}}>2 students have exceeded their approved return time.</p>
      </Card>

      <div className="search-filter-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button className={`tab-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`tab-btn ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>Approved</button>
          <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        </div>
      </div>

      <div className="request-list">
        {filteredOutpasses.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} className="text-muted" style={{opacity: 0.5, marginBottom: 16}} />
            <p className="text-h3 text-muted">No {filter} requests found.</p>
          </div>
        ) : (
          filteredOutpasses.map(req => (
            <Card 
              key={req.id} 
              hoverable 
              className="request-card"
              onClick={() => navigate(`/warden/request/${req.id}`)}
            >
              <div className="req-header">
                <div>
                  <h3 className="font-semibold">{req.studentName}</h3>
                  <span className="text-xs text-muted">{req.id}</span>
                </div>
                {getStatusBadge(req.status)}
              </div>
              
              <p className="text-sm font-medium" style={{margin: '12px 0'}}>{req.reason}</p>
              
              <div className="req-footer">
                <span className="text-xs text-muted">Out: {formatDate(req.dateOut)}</span>
                <ChevronRight size={16} className="text-muted" />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
