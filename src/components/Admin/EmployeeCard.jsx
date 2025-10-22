import React from 'react';
import { FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import styles from './EmployeeCard.module.css';

const EmployeeCard = ({ employee, onEdit, onArchive, onView, onRestore, onDelete, archived }) => {
  return (
    <div className={styles.card}>
      <img src={employee.image} alt={employee.name} className={styles.avatar} />
      <div className={styles.info}>
        <div className={styles.name}>{employee.name}</div>
        <div className={styles.meta}>{employee.designation} • {employee.department}</div>
        <div className={styles.meta}>DOB: {new Date(employee.dob).toLocaleDateString()}</div>
      </div>

      <div className={styles.actions}>
        {!archived && <button aria-label="view" className={styles.iconBtn} onClick={onView}><FiUser /></button>}
        {!archived && <button aria-label="edit" className={styles.iconBtn} onClick={onEdit}><FiEdit2 /></button>}
        {archived ? (
          <>
            <button aria-label="restore" className={styles.iconBtn} onClick={onRestore}>⤺</button>
            <button aria-label="delete" className={styles.iconBtnDanger} onClick={onDelete}>✖</button>
          </>
        ) : (
          <button aria-label="archive" className={styles.iconBtnDanger} onClick={onArchive}><FiTrash2 /></button>
        )}
      </div>

      <div className={styles.badge}>{employee.id}</div>

      <div className={styles.cardOverlay} aria-hidden>
        <div className={styles.overlayInner}>
          <div className={styles.overlayName}>{employee.name}</div>
          <div className={styles.overlayMeta}>{employee.designation} • {employee.department}</div>
          <div className={styles.overlayActions}>
            <button className={styles.iconBtn} onClick={onView} title="View"><FiUser /></button>
            <button className={styles.iconBtn} onClick={onEdit} title="Edit"><FiEdit2 /></button>
            <button className={styles.iconBtnDanger} onClick={onArchive} title="Archive"><FiTrash2 /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
