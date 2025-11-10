import React, { useState } from 'react';
import styles from './QuickEditModal.module.css';
import employeesData from '../../data/employees.json';
import { useSelector } from 'react-redux';

const ChangePasswordModal = ({ employee, onClose, onSave }) => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const currentUser = useSelector(s => s.auth?.user);

  const findStored = () => {
    try {
      const raw = sessionStorage.getItem('hrms_employees') || JSON.stringify(employeesData || []);
      const arr = JSON.parse(raw);
      return arr;
    } catch (e) { return employeesData || []; }
  };

  const handleSave = () => {
    setError('');
    if (!newPass || newPass.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (newPass !== confirm) { setError('New password and confirmation do not match'); return; }

    const arr = findStored();
    const idx = arr.findIndex(e => e.id === employee.id || e.email === employee.email);

    
    if (idx !== -1) {
      const rec = arr[idx];
      if (rec.password && rec.password.length > 0) {
        if (rec.password !== current) { setError('Current password is incorrect'); return; }
      }
      // update password
      arr[idx] = { ...rec, password: newPass };
      try { sessionStorage.setItem('hrms_employees', JSON.stringify(arr)); } catch {}
    } else {
      // create a minimal record with password
      const newRec = { id: employee.id, name: employee.name, email: employee.email, role: employee.role || 'employee', password: newPass };
      arr.push(newRec);
      try { sessionStorage.setItem('hrms_employees', JSON.stringify(arr)); } catch {}
    }

    // update remembered creds if current user chose remember
    try {
      const rem = localStorage.getItem('hrms_remember');
      if (rem) {
        const obj = JSON.parse(rem);
        if (obj && (obj.email === employee.email || obj.email === employee.id)) {
          localStorage.setItem('hrms_remember', JSON.stringify({ email: obj.email, password: newPass }));
        }
      }
    } catch (e) { console.error(e); }

    try { sessionStorage.setItem(`hrms_user_profile_${employee.id}`, JSON.stringify({ ...employee, password: newPass })); } catch {}

    // if currently logged-in user, call onSave to update UI
    if (currentUser && (currentUser.id === employee.id || currentUser.email === employee.email)) {
      onSave && onSave({ ...employee, password: newPass });
    } else {
      onSave && onSave({ ...employee, password: newPass });
    }

    onClose && onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Change password</h3>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <label>Current password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current password" />
          </div>

          <div className={styles.row}>
            <label>New password</label>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password" />
          </div>

          <div className={styles.row}>
            <label>Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" />
          </div>

          {error ? <div style={{ color: '#e11d48', marginTop: 8 }}>{error}</div> : null}
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} onClick={handleSave}>Change password</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
