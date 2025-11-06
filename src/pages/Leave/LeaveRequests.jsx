import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './LeaveRequests.module.css';
import { FiPlus, FiTrash2, FiEdit2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import demoUsers from '../../data/demoUsers.json';

// Helper: read all user leave lists from sessionStorage and tag with ownerId
const readAllLeaves = () => {
  const all = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!key) continue;
    if (key.startsWith('hrms_user_leaves_')) {
      const ownerId = key.replace('hrms_user_leaves_', '');
      try {
        const arr = JSON.parse(sessionStorage.getItem(key) || '[]');
        arr.forEach(item => all.push({ ...item, ownerId }));
      } catch {
        // ignore malformed
      }
    }
  }
  // sort newest first
  all.sort((a, b) => (b.createdAt || 0) > (a.createdAt || 0) ? 1 : -1);
  return all;
};

const LeaveRequests = () => {
  const user = useSelector(s => s.auth.user);
  const role = user?.role || 'guest';

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ from: '', to: '', reason: '', type: '' });
  const [rejectModal, setRejectModal] = useState({ show: false, leaveId: null, ownerId: null });
  const [rejectRemark, setRejectRemark] = useState('');

  // Validation helpers
  const validateFrom = (f) => {
    if (!f) return 'From date is required';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromDate = new Date(f);
    fromDate.setHours(0, 0, 0, 0);
    if (fromDate < today) return 'From date cannot be in the past';
    // Limit requests to next 6 months
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    if (fromDate > sixMonthsFromNow) return 'Cannot request leave more than 6 months in advance';
    return '';
  };
  
  const validateTo = (t, f) => {
    if (!t) return 'To date is required';
    if (f && t < f) return 'To date cannot be before From date';
    if (!f) return '';
    // Maximum 30 days leave at once
    const days = computeDays(f, t);
    if (days > 30) return 'Maximum leave duration is 30 days';
    return '';
  };
  
  const validateType = (ty) => {
    if (!ty) return 'Leave type is required';
    return '';
  };
  
  const validateReason = (r) => {
    if (!r || r.trim().length === 0) return 'Reason is required';
    if (r.trim().length < 10) return 'Please provide a more detailed reason (minimum 10 characters)';
    if (r.trim().length > 200) return 'Reason is too long (maximum 200 characters)';
    return '';
  };

  const computeDays = (f, t) => {
    if (!f || !t) return 0;
    const d1 = new Date(f);
    const d2 = new Date(t);
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
  };

  const isCreateFormValid = () => {
    return from && to && type && reason && reason.trim().length >= 3 && from <= to;
  };

  const isEditFormValid = () => {
    return editValues.from && editValues.to && editValues.type && editValues.reason && editValues.reason.trim().length >= 3 && editValues.from <= editValues.to;
  };

  const storageKey = user ? `hrms_user_leaves_${user.id}` : 'hrms_user_leaves_guest';

  // load either user's own leaves or all leaves for HR/Admin
  useEffect(() => {
    if (role === 'hr' || role === 'admin') {
      setLeaves(readAllLeaves());
    } else {
      try {
        const raw = sessionStorage.getItem(storageKey) || '[]';
        setLeaves(JSON.parse(raw));
      } catch {
        setLeaves([]);
      }
    }
  }, [storageKey, role]);

  const persistToOwner = (ownerId, list) => {
    const key = `hrms_user_leaves_${ownerId}`;
    sessionStorage.setItem(key, JSON.stringify(list));
  };

  const createRequest = (e) => {
    e.preventDefault();
    setError('');
    
    // Run all validations
    const fromError = validateFrom(from);
    const toError = validateTo(to, from);
    const typeError = validateType(type);
    const reasonError = validateReason(reason);
    
    if (fromError || toError || typeError || reasonError) {
      setError(fromError || toError || typeError || reasonError);
      return;
    }
    
    const ownerId = user ? user.id : 'guest';
    const days = computeDays(from, to);
    
    const req = {
      id: `L${Date.now()}`,
      from,
      to,
      days,
      reason,
      type,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ownerId
    };
    
    // save to owner's list
    const ownerKey = `hrms_user_leaves_${ownerId}`;
    const existing = JSON.parse(sessionStorage.getItem(ownerKey) || '[]');
    
    // Check for overlapping leave requests
    const hasOverlap = existing.some(leave => {
      const existingStart = new Date(leave.from);
      const existingEnd = new Date(leave.to);
      const newStart = new Date(from);
      const newEnd = new Date(to);
      return (
        leave.status !== 'Rejected' &&
        ((newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd))
      );
    });
    
    if (hasOverlap) {
      setError('You already have a leave request for these dates');
      return;
    }
    
    const nextOwner = [req, ...existing];
    sessionStorage.setItem(ownerKey, JSON.stringify(nextOwner));

    // refresh view
    if (role === 'hr' || role === 'admin') setLeaves(readAllLeaves());
    else setLeaves(nextOwner);

    setFrom(''); setTo(''); setReason(''); setType('');
    setError('Leave request created successfully');
    setTimeout(() => setError(''), 3000);
  };

  const deleteRequest = (ownerId, id) => {
    const key = `hrms_user_leaves_${ownerId}`;
    const arr = JSON.parse(sessionStorage.getItem(key) || '[]');
    const next = arr.filter(x => x.id !== id);
    sessionStorage.setItem(key, JSON.stringify(next));
    if (role === 'hr' || role === 'admin') setLeaves(readAllLeaves());
    else setLeaves(next);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValues({ from: item.from, to: item.to, reason: item.reason || '', type: item.type || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ from: '', to: '', reason: '' });
  };

  const saveEdit = (ownerId, id) => {
    if (!editValues.from || !editValues.to) { setError('Please provide both dates.'); return; }
    if (editValues.from > editValues.to) { setError('From date cannot be later than To date.'); return; }
    if (!editValues.type) { setError('Please choose a leave type.'); return; }
    if (!editValues.reason || editValues.reason.trim().length < 3) { setError('Please provide a brief reason (at least 3 chars).'); return; }
    const key = `hrms_user_leaves_${ownerId}`;
    const arr = JSON.parse(sessionStorage.getItem(key) || '[]');
  const next = arr.map(x => x.id === id ? { ...x, from: editValues.from, to: editValues.to, reason: editValues.reason, type: editValues.type } : x);
    sessionStorage.setItem(key, JSON.stringify(next));
    if (role === 'hr' || role === 'admin') setLeaves(readAllLeaves()); else setLeaves(next);
    cancelEdit();
  };

  const setStatus = (ownerId, id, status, remark = '') => {
    const key = `hrms_user_leaves_${ownerId}`;
    const arr = JSON.parse(sessionStorage.getItem(key) || '[]');
    const next = arr.map(x => x.id === id ? {
      ...x,
      status,
      statusUpdatedAt: new Date().toISOString(),
      statusUpdatedBy: user?.name || 'HR',
      rejectionRemark: status === 'Rejected' ? remark : undefined
    } : x);
    sessionStorage.setItem(key, JSON.stringify(next));
    if (role === 'hr' || role === 'admin') setLeaves(readAllLeaves()); else setLeaves(next);
    setRejectModal({ show: false, leaveId: null, ownerId: null });
    setRejectRemark('');
  };

  const handleReject = () => {
    if (!rejectRemark.trim()) {
      setError('Please provide a rejection remark');
      return;
    }
    setStatus(rejectModal.ownerId, rejectModal.leaveId, 'Rejected', rejectRemark.trim());
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.title}>Leave Requests</div>
      </div>

      {!user && <div style={{marginBottom:12,color:'#92400e',background:'#fff7ed',padding:10,borderRadius:8}}>You are not signed in. Requests will be saved for this session only.</div>}

      {role === 'admin' ? (
        <div className={styles.infoCard} style={{marginBottom:12, padding:12, borderRadius:8, background:'#eef2ff', color:'#1e3a8a'}}>
          Creating leave requests is disabled for admin users. To create a request on behalf of an employee, use their profile.
        </div>
      ) : (
        <form onSubmit={createRequest} className={styles.formCard}>
        <div className={styles.formInner}>
          <div className={styles.field}>
            <label className={styles.meta}>From <span style={{color:'#ef4444'}}>*</span></label>
            <input className={styles.input} type="date" value={from} onChange={e=>setFrom(e.target.value)} />
            {validateFrom(from) && <div className={styles.fieldError}>{validateFrom(from)}</div>}
          </div>
          <div className={styles.field}>
            <label className={styles.meta}>To <span style={{color:'#ef4444'}}>*</span></label>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input className={styles.input} type="date" value={to} onChange={e=>setTo(e.target.value)} />
              {from && to && <span className={styles.daysBadge}>{computeDays(from, to)} days</span>}
            </div>
            {validateTo(to, from) && <div className={styles.fieldError}>{validateTo(to, from)}</div>}
          </div>
          <div className={styles.field}>
            <label className={styles.meta}>Type <span style={{color:'#ef4444'}}>*</span></label>
            <select className={`${styles.select}`} value={type} onChange={e=>setType(e.target.value)}>
              <option value="">Choose type</option>
              <option value="Paid">Paid Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
              <option value="Other">Other</option>
            </select>
            {validateType(type) && <div className={styles.fieldError}>{validateType(type)}</div>}
          </div>
          <div className={`${styles.field} ${styles.reasonInput}`}>
            <label className={styles.meta}>Reason <span style={{color:'#ef4444'}}>*</span></label>
            <input className={`${styles.input} ${styles.reasonInput}`} placeholder="Short reason" value={reason} onChange={e=>setReason(e.target.value)} />
            {validateReason(reason) && <div className={styles.fieldError}>{validateReason(reason)}</div>}
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" disabled={!isCreateFormValid()} className={styles.createBtn}><FiPlus /> Create</button>
        </div>
        </form>
      )}
      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.listGrid}>
        {leaves.length === 0 ? (
          <div className={styles.emptyState}>No leave requests yet.</div>
        ) : (
          leaves.map(l => {
            const ownerId = l.ownerId || (user ? user.id : 'guest');
            const isMine = !l.ownerId || (user && l.ownerId === user.id) || (!user && ownerId === 'guest');
            const statusClass = l.status === 'Approved' ? styles.approved : (l.status === 'Rejected' ? styles.rejected : styles.pending);
            // try to resolve owner display name and avatar
            const ownerRecordJson = sessionStorage.getItem(`hrms_user_profile_${ownerId}`) || null;
            let ownerName = ownerId;
            let ownerAvatar = `https://i.pravatar.cc/150?u=${ownerId}`;
            try {
              if (ownerRecordJson) {
                const r = JSON.parse(ownerRecordJson);
                ownerName = r.name || ownerId;
                ownerAvatar = r.picture || r.image || ownerAvatar;
              } else {
                // fallback to hrms_employees list
                const empsRaw = sessionStorage.getItem('hrms_employees') || '[]';
                const emps = JSON.parse(empsRaw);
                const found = emps.find(e => e.id === ownerId);
                if (found) { ownerName = found.name || ownerId; ownerAvatar = found.picture || found.image || ownerAvatar; }
                else {
                  // fallback to demoUsers
                  const du = Object.values(demoUsers).find(u => u.id === ownerId || u.email === ownerId);
                  if (du) { ownerName = du.name; ownerAvatar = du.image || ownerAvatar; }
                }
              }
            } catch {
              // ignore
            }

            return (
              <div key={l.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div style={{flex:1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                      <div className={styles.range}>{l.from} → {l.to}</div>
                      <div className={styles.daysBadge}>{computeDays(l.from, l.to)} days</div>
                      <span className={`${styles.status} ${statusClass}`}>{l.status}</span>
                    </div>
                    
                    <div className={styles.reasonBox}>
                      <div className={styles.reasonLabel}>Reason:</div>
                      <div className={styles.reasonText}>{l.reason || '—'}</div>
                    </div>
                    
                    <div className={styles.leaveType}>
                      <span className={styles.typeLabel}>Type:</span>
                      <span className={styles.typeValue}>{l.type}</span>
                    </div>

                    {l.status === 'Rejected' && l.rejectionRemark && (
                      <div className={styles.rejectionRemark}>
                        <div className={styles.rejectionLabel}>Rejection Reason:</div>
                        <div className={styles.rejectionText}>{l.rejectionRemark}</div>
                      </div>
                    )}

                    <div className={styles.metaInfo}>
                      <div className={styles.ownerRow}>
                        <img className={styles.avatar} src={ownerAvatar} alt={ownerName} />
                        <div>
                          <div className={styles.ownerName}>{ownerName}</div>
                          <div className={styles.ownerId}>{ownerId}</div>
                        </div>
                      </div>
                      <div className={styles.dateSubmitted}>
                        <div>Submitted: {new Date(l.createdAt).toLocaleDateString()}</div>
                        {l.statusUpdatedAt && (
                          <div className={styles.statusUpdate}>
                            {l.status} by {l.statusUpdatedBy} on {new Date(l.statusUpdatedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    {l.status === 'Pending' && (isMine || role === 'hr' || role === 'admin') && 
                      <button onClick={() => deleteRequest(ownerId, l.id)} className={`${styles.btn} ${styles.btnDanger}`}>
                        <FiTrash2 /> Cancel Request
                      </button>
                    }
                    {(role === 'hr' || role === 'admin') && l.status === 'Pending' && (
                      <div className={styles.adminActions}>
                        <button onClick={() => setStatus(ownerId, l.id, 'Approved')} className={`${styles.btn} ${styles.btnPrimary}`}>
                          <FiCheckCircle /> Approve
                        </button>
                        <button 
                          onClick={() => setRejectModal({ show: true, leaveId: l.id, ownerId })} 
                          className={`${styles.btn} ${styles.btnDanger}`}
                        >
                          <FiXCircle /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {editingId === l.id && (
                  <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
                    <div style={{flex:'0 1 auto'}}>
                      <input className={styles.input} type="date" value={editValues.from} onChange={e=>setEditValues(ev=>({...ev,from:e.target.value}))} />
                      {validateFrom(editValues.from) && <div className={styles.fieldError}>{validateFrom(editValues.from)}</div>}
                    </div>
                    <div style={{flex:'0 1 auto'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <input className={styles.input} type="date" value={editValues.to} onChange={e=>setEditValues(ev=>({...ev,to:e.target.value}))} />
                        {editValues.from && editValues.to && <span className={styles.daysBadge}>{computeDays(editValues.from, editValues.to)} days</span>}
                      </div>
                      {validateTo(editValues.to, editValues.from) && <div className={styles.fieldError}>{validateTo(editValues.to, editValues.from)}</div>}
                    </div>
                    <div style={{flex:'0 1 auto'}}>
                      <select className={styles.select} value={editValues.type} onChange={e=>setEditValues(ev=>({...ev,type:e.target.value}))}>
                        <option value="">Choose type</option>
                        <option value="Paid">Paid Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Unpaid">Unpaid Leave</option>
                        <option value="Other">Other</option>
                      </select>
                      {validateType(editValues.type) && <div className={styles.fieldError}>{validateType(editValues.type)}</div>}
                    </div>
                    <div style={{flex:'1 1 auto'}}>
                      <input className={styles.input} value={editValues.reason} onChange={e=>setEditValues(ev=>({...ev,reason:e.target.value}))} />
                      {validateReason(editValues.reason) && <div className={styles.fieldError}>{validateReason(editValues.reason)}</div>}
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={() => saveEdit(ownerId, l.id)} disabled={!isEditFormValid()} className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
                      <button onClick={cancelEdit} className={`${styles.btn} ${styles.btnGhost}`}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        {/* Rejection Modal */}
        {rejectModal.show && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>Reject Leave Request</h3>
              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label className={styles.meta}>Rejection Remark <span style={{color:'#ef4444'}}>*</span></label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    value={rejectRemark}
                    onChange={(e) => setRejectRemark(e.target.value)}
                    placeholder="Please provide a reason for rejection"
                    rows={3}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button onClick={() => setRejectModal({ show: false, leaveId: null, ownerId: null })} className={`${styles.btn} ${styles.btnGhost}`}>Cancel</button>
                <button onClick={handleReject} className={`${styles.btn} ${styles.btnDanger}`}>Reject Leave</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
