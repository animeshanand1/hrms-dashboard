import React, { useEffect, useMemo, useState } from 'react';
import employeesData from '../../data/employees.json';
import EmployeeCard from '../../components/Admin/EmployeeCard';
import styles from '../../components/Admin/EmployeeCard.module.css';
import QuickEditModal from '../../components/Common/QuickEditModal';
import localStyles from './EmployeeList.module.css';

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');
  const [selected, setSelected] = useState(null);
  const [lastArchived, setLastArchived] = useState(null);
  const undoTimeoutRef = React.useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
     
      const sess = sessionStorage.getItem('hrms_employees');
      if (sess) {
        try { setEmployees(JSON.parse(sess)); }
        catch { setEmployees(employeesData); }
      } else {
        setEmployees(employeesData);
      }
      setLoading(false);
    }, 650);
    return () => clearTimeout(t);
  }, []);

  const departments = useMemo(() => {
    const setDept = new Set(employeesData.map(e => e.department));
    return ['all', ...Array.from(setDept)];
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return employees.filter(e => {
      if (dept !== 'all' && e.department !== dept) return false;
      if (!s) return true;
      return (
        e.name.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s)
      );
    });
  }, [employees, search, dept]);

  const handleEdit = emp => {
    setSelected(emp);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleView = emp => {
    setSelected(emp);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleArchive = id => {
    
    setEmployees(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;
      const toArchive = prev[idx];
      const rest = prev.filter(e => e.id !== id);

      // save updated employees
      sessionStorage.setItem('hrms_employees', JSON.stringify(rest));

      // append to archive list if not already present
      const archived = JSON.parse(sessionStorage.getItem('hrms_archived') || '[]');
      const exists = archived.some(a => a.id === toArchive.id);
      const nextArchived = exists ? archived : [toArchive, ...archived];
      sessionStorage.setItem('hrms_archived', JSON.stringify(nextArchived));

      // set lastArchived for undo
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = null;
      }
      setLastArchived({ employee: toArchive });
      undoTimeoutRef.current = setTimeout(() => setLastArchived(null), 6000);

      return rest;
    });
  };

  const handleUndoArchive = () => {
    if (!lastArchived) return;
    const toRestore = lastArchived.employee;

    // remove from archived storage
    const archived = JSON.parse(sessionStorage.getItem('hrms_archived') || '[]');
    const nextArchived = archived.filter(a => a.id !== toRestore.id);
    sessionStorage.setItem('hrms_archived', JSON.stringify(nextArchived));

    // add back to employees 
    const employeesNow = JSON.parse(sessionStorage.getItem('hrms_employees') || '[]');
    const deduped = employeesNow.filter(e => e.id !== toRestore.id);
    const nextEmployees = [toRestore, ...deduped];
    sessionStorage.setItem('hrms_employees', JSON.stringify(nextEmployees));
    setEmployees(nextEmployees);

    // clear lastArchived and timeout
    if (undoTimeoutRef.current) { clearTimeout(undoTimeoutRef.current); undoTimeoutRef.current = null; }
    setLastArchived(null);
  };

  const handleSave = updated => {
    setEmployees(prev => {
      const next = prev.map(e => (e.id === updated.id ? updated : e));
      sessionStorage.setItem('hrms_employees', JSON.stringify(next));
      return next;
    });
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <div style={{ padding: 20, height: 'calc(100vh - 40px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <h2>All employees</h2>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 8, pointerEvents: 'none', color: '#9ca3af' }}>
            {/* simple search icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            aria-label="Search employees"
            placeholder="Search by name or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '10px 12px 10px 34px', borderRadius: 999, border: '1px solid #e6eef8', minWidth: 260, background: '#fbfdff' }}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>{filtered.length} shown</div>
          <select value={dept} onChange={e => setDept(e.target.value)} className={localStyles.select}>
            {departments.map(d => (
              <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>
            ))}
          </select>
        </div>
      </div>

      
      <div style={{ marginTop: 12, flex: 1, overflowY: 'auto', paddingRight: 8 }}>
        {loading ? (
          <div className={styles.cardGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`}>
                <div className={styles.skelAvatar} />
                <div style={{ flex: 1 }}>
                  <div className={styles.skelLine} style={{ width: '60%' }} />
                  <div className={styles.skelLine} style={{ width: '40%', marginTop: 8 }} />
                </div>
                <div style={{ width: 60 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
            <h3>No employees found</h3>
            <p>Try clearing filters or add new employees.</p>
            <button onClick={() => { setSearch(''); setDept('all'); }} style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none' }}>Clear filters</button>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {filtered.map(emp => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onEdit={() => handleEdit(emp)}
                onArchive={() => handleArchive(emp.id)}
                onView={() => handleView(emp)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && selected && (
        <QuickEditModal
          employee={selected}
          mode={modalMode}
          onClose={() => { setModalOpen(false); setSelected(null); }}
          onSave={handleSave}
        />
      )}

      {/* undo snackbar */}
      {lastArchived && (
        <div style={{ position: 'fixed', right: 24, bottom: 24, background: '#111827', color: '#fff', padding: '12px 14px', borderRadius: 8, boxShadow: '0 8px 30px rgba(2,6,23,0.5)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div>Archived {lastArchived.employee.name}</div>
            <button onClick={handleUndoArchive} style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none' }}>Undo</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
