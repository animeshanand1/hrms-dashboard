import React, { useState } from 'react';
import styles from './QuickEditModal.module.css';

const QuickEditModal = ({ employee, mode = 'edit', onClose, onSave }) => {
  const [form, setForm] = useState({ ...employee });

  const canEdit = mode === 'edit';

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{mode === 'view' ? 'View profile' : 'Quick edit'}</h3>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <label>ID</label>
            <input name="id" value={form.id} disabled />
          </div>

          <div className={styles.row}>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} disabled={!canEdit} />
          </div>

          <div className={styles.row}>
            <label>Designation</label>
            <input name="designation" value={form.designation} onChange={handleChange} disabled={!canEdit} />
          </div>

          <div className={styles.row}>
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} disabled={!canEdit} />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose}>Close</button>
          {canEdit && <button className={styles.btnPrimary} onClick={() => onSave(form)}>Save</button>}
        </div>
      </div>
    </div>
  );
};

export default QuickEditModal;
