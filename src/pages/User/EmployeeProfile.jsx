import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './EmployeeProfile.module.css';
import demoUsers from '../../data/demoUsers.json';
import employeesData from '../../data/employees.json';
import QuickEditModal from '../../components/Common/QuickEditModal';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    if (!id) return;
    
    try {
      const raw = sessionStorage.getItem(`hrms_user_profile_${id}`);
      if (raw) {
        setProfile(JSON.parse(raw));
        return;
      }
    } catch {}

    // hrms_employees stored list
    try {
      const empsRaw = sessionStorage.getItem('hrms_employees') || JSON.stringify(employeesData || []);
      const emps = JSON.parse(empsRaw);
      const found = emps.find(e => e.id === id || e.email === id);
      if (found) { setProfile(found); return; }
    } catch {}

    // Fallback to demo users
    try {
      const du = Object.values(demoUsers).find(u => u.id === id || u.email === id);
      if (du) { setProfile(du); return; }
    } catch {}

    // in case of empty/null data show basic id
    setProfile({ id, name: id });
  }, [id]);

  if (!profile) return <div style={{padding:20}}>Loading...</div>;


  const employmentHistory = profile.history || profile.employmentHistory || [];

  
  const doj = profile.hiredDate
    || (employmentHistory.find(h => (h.to || '').toLowerCase() === 'present') || employmentHistory[employmentHistory.length - 1])?.from
    || '—';

  const salary = profile.salary || { basic: profile.basicSalary || '—', allowances: profile.allowances || [], deductions: profile.deductions || [] };
  const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

  const renderChips = (arr) => {
    if (!arr || !arr.length) return <span>—</span>;
    return <div className={styles.chips}>{arr.map((a,i) => <div key={i} className={styles.chip}>{a}</div>)}</div>;
  };

  // compute tenure from hiredDate to today
  const computeTenure = (dateStr) => {
    if (!dateStr) return '—';
    const start = new Date(dateStr);
    if (isNaN(start)) return '—';
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) { years -= 1; months += 12; }
    const yLabel = years > 0 ? `${years} ${years === 1 ? 'Year' : 'Years'}` : '';
    const mLabel = months > 0 ? `${months} ${months === 1 ? 'Month' : 'Months'}` : '';
    return (yLabel && mLabel) ? `${yLabel} ${mLabel}` : (yLabel || mLabel || '0 Months');
  };

  const parseNumber = v => {
    if (v === undefined || v === null || v === '') return 0;
    if (typeof v === 'number') return v;
    const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const basicNum = parseNumber(salary.basic);
  const allowancesArr = Array.isArray(salary.allowances) ? salary.allowances : (salary.allowances ? [salary.allowances] : []);
  const deductionsArr = Array.isArray(salary.deductions) ? salary.deductions : (salary.deductions ? [salary.deductions] : []);
  const allowancesSum = allowancesArr.reduce((s, a) => s + parseNumber(a), 0);
  const deductionsSum = deductionsArr.reduce((s, d) => s + parseNumber(d), 0);
  const totalCTC = basicNum + allowancesSum; 
  const netPay = basicNum + allowancesSum - deductionsSum;

  return (
    <div className={styles.container}>
      <Link to="/leave/requests" className={styles.backBtn} aria-label="Back to requests"><FiArrowLeft /></Link>
      <div className={styles.cover}>
        {/* place the edit icon inside the cover/banner (top-right) */}
        {(user && (user.role === 'admin' || user.role === 'hr')) ? (
          <button className={styles.editBtn} title="Edit employment" onClick={() => setEditing(true)}><FiEdit /></button>
        ) : (user && user.id === profile.id) ? (
          <button className={styles.editBtn} title="Edit contact" onClick={() => setEditing(true)}><FiEdit /></button>
        ) : null}
      </div>
      <div className={styles.profileHeader}>
  <div className={styles.avatarWrap}><div className={styles.avatar}>{profile.picture ? <img src={profile.picture} alt={profile.name} /> : <div className={styles.letter}>{(profile.name||'')[0]}</div>}</div></div>
        <div className="nameRow">
          <h2>{profile.name || profile.id}</h2>
          <div className={styles.meta} style={{display:'flex', gap:12, alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>ID: {profile.id}</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 12l9-5-9-5-9 5 9 5z" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12v9" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>{profile.designation || '—'}</span>
            </div>
          </div>
          <div className={styles.roleBadge}>{(profile.role || profile.jobType || 'Employee').toString()}</div>
          <div className={styles.statRow}>
            <div className={styles.stat}>Department: {profile.department || '—'}</div>
            <div className={styles.stat}>Location: {profile.location || '—'}</div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.cardSummary}>
          <h3><svg viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20c0-2.209 3.582-4 8-4s8 1.791 8 4" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Employee Details</h3>
          <div className={styles.summaryRow}><span className={styles.summaryLabel}><svg viewBox="0 0 24 24" fill="none"><path d="M8 7V3h8v4" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 21H4V7h16v14z" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Date of joining</span><span>{doj}</span></div>
          <div className={styles.summaryRow}><span className={styles.summaryLabel}><svg viewBox="0 0 24 24" fill="none"><path d="M3 13h18" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 7v14" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Tenure</span><span>{computeTenure(profile.hiredDate || profile.startDate)}</span></div>
          <div className={styles.summaryRow}><span className={styles.summaryLabel}><svg viewBox="0 0 24 24" fill="none"><path d="M3 7h18" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 7v14" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Job type</span><span>{profile.jobType || profile.type || 'Full-time'}</span></div>
          <div className={styles.summaryRow}><span className={styles.summaryLabel}><svg viewBox="0 0 24 24" fill="none"><path d="M3 3h18v4H3z" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11h18v10H3z" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Department</span><span>{profile.department || '—'}</span></div>
          <div className={styles.summaryRow}><span className={styles.summaryLabel}><svg viewBox="0 0 24 24" fill="none"><path d="M9 7h6v6H9z" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Location</span><span>{profile.location || '—'}</span></div>
        </section>

        <section className={styles.card}>
          <h3><svg viewBox="0 0 24 24" fill="none"><path d="M12 1v22" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 7h16" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Compensation</h3>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
            <div>
              <div style={{color:'#64748b', fontSize:13}}>Total annual (approx.)</div>
              <div style={{fontSize:28, fontWeight:700, color:'#0f172a'}}>{totalCTC ? fmt.format(totalCTC) : '—'}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{color:'#64748b', fontSize:13}}>Net take-home</div>
              <div style={{fontSize:18, fontWeight:600}}>{fmt.format(netPay)}</div>
            </div>
          </div>

          <div style={{marginTop:14}}>
            <div style={{display:'flex', justifyContent:'space-between', padding:'6px 0'}}><span>Basic</span><strong>{fmt.format(basicNum)}</strong></div>
            <div style={{display:'flex', justifyContent:'space-between', padding:'6px 0'}}><span>Allowances</span><strong>{fmt.format(allowancesSum)}</strong></div>
            <div style={{display:'flex', justifyContent:'space-between', padding:'6px 0'}}><span>Deductions</span><strong>-{fmt.format(deductionsSum)}</strong></div>
            <div style={{height:1, background:'#eef2f6', margin:'12px 0'}} />
            <div style={{display:'flex', justifyContent:'space-between', padding:'6px 0', fontWeight:700}}><span>Net pay</span><span>{fmt.format(netPay)}</span></div>
          </div>
        </section>

        <section className={styles.card}>
          <h3><svg viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10a5 5 0 0 1 10 0" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Contact & Employment</h3>
          <div className={styles.contactList}>
            <div className={styles.contactItem}><svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4z" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg><div>{profile.email || '—'}</div></div>
            <div className={styles.contactItem}><svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92V21a1 1 0 0 1-1.11 1A19 19 0 0 1 3 4.11 1 1 0 0 1 4 3h4.09a1 1 0 0 1 1 .75c.12.97.36 1.91.71 2.81a1 1 0 0 1-.24 1.05L8.7 9.7a12.07 12.07 0 0 0 6.6 6.6l1.1-1.1a1 1 0 0 1 1.05-.24c.9.35 1.84.59 2.81.71a1 1 0 0 1 .75 1V21z" stroke="#64748b" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round"/></svg><div>{profile.phone || '—'}</div></div>
            <div className={styles.contactItem}><svg viewBox="0 0 24 24" fill="none"><path d="M21 10h-6V4" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 21h10" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg><div>Hired: {profile.hiredDate || '—'}</div></div>
          </div>
        </section>
      </div>

      {editing && (
        <QuickEditModal
          employee={profile}
          mode="edit"
          onClose={() => setEditing(false)}
          onSave={(updated) => {
            
            try {
              sessionStorage.setItem(`hrms_user_profile_${profile.id}`, JSON.stringify(updated));
            } catch {}
            
            try {
              const empsRaw = sessionStorage.getItem('hrms_employees') || JSON.stringify(employeesData || []);
              const emps = JSON.parse(empsRaw);
              const idx = emps.findIndex(e => e.id === profile.id || e.email === profile.id);
              if (idx !== -1) { emps[idx] = { ...emps[idx], ...updated }; }
              else { emps.push(updated); }
              sessionStorage.setItem('hrms_employees', JSON.stringify(emps));
            } catch {}
            setProfile(updated);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeProfile;
