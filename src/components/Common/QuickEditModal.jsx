import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './QuickEditModal.module.css';

const QuickEditModal = ({ employee, mode = 'edit', onClose, onSave }) => {
  const [form, setForm] = useState({
    ...employee,
  });
  const navigate = useNavigate();

  const canEditMode = mode === 'edit';
  const currentUser = useSelector(s => s.auth?.user);

  // permission helpers
  const canEditSalary = canEditMode && currentUser && (currentUser.role === 'admin' || currentUser.role === 'hr');
  const canEditBasicInfo = canEditMode && currentUser && (currentUser.role === 'admin' || currentUser.role === 'hr');
  const canEditContact = canEditMode && currentUser && (currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.id === form.id);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, picture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          {mode === 'view' ? (
            <h3
              onClick={() => {
                // navigate to dedicated profile page
                if (form && form.id) navigate(`/employee/${form.id}`);
              }}
              title="Open full profile"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              View profile
            </h3>
          ) : (
            <h3>Quick edit</h3>
          )}
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={`${styles.row} ${styles.full}`}>
            <label>ID</label>
            <input name="id" value={form.id} disabled />
          </div>

          <div className={`${styles.row} ${styles.full}`}>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} disabled={!canEditBasicInfo} />
          </div>

          <div className={styles.row}>
            <label>Designation</label>
            <input name="designation" value={form.designation} onChange={handleChange} disabled={!canEditBasicInfo} />
          </div>

          <div className={styles.row}>
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} disabled={!canEditBasicInfo} />
          </div>

          <div className={styles.row}>
            <label>Email</label>
            <input name="email" value={form.email || ''} onChange={handleChange} disabled={!canEditContact || (currentUser && currentUser.role === 'employee' && currentUser.id === form.id)} />
          </div>

          <div className={styles.row}>
            <label>Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} disabled={!canEditContact} />
          </div>

          {/* Allow changing profile picture for owners and admins/HR */}
          <div className={styles.row}>
            <label>Profile picture</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input name="picture" type="file" accept="image/*" onChange={handleFileChange} disabled={!canEditContact} />
              {form.picture ? <img src={form.picture} alt="preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} /> : null}
            </div>
          </div>

          <div className={styles.row}>
            <label>Hired date</label>
            <input name="hiredDate" type="date" value={form.hiredDate || ''} onChange={handleChange} disabled={!canEditContact || (currentUser && currentUser.role === 'employee' && currentUser.id === form.id)} />
          </div>

          <div className={styles.row}>
            <label>Job type</label>
            <input name="jobType" value={form.jobType || ''} onChange={handleChange} disabled={!canEditBasicInfo} />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose}>Close</button>
          {(canEditMode && (canEditContact || canEditBasicInfo || canEditSalary)) && (
            <button className={styles.btnPrimary} onClick={() => {
              const out = { ...form };
             onSave(out);
            }}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickEditModal;
