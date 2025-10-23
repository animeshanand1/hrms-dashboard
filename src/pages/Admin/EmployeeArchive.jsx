import React, { useEffect, useState } from 'react';
import EmployeeCard from '../../components/Admin/EmployeeCard';
import styles from '../../components/Admin/EmployeeCard.module.css';

const EmployeeArchive = () => {
  const [archived, setArchived] = useState([]);

  useEffect(() => {
    const a = JSON.parse(sessionStorage.getItem('hrms_archived') || '[]');
    setArchived(a);
  }, []);

  const handleRestore = id => {
    const toRestore = archived.find(e => e.id === id);
    if (!toRestore) return;
    // remove from archived
    const next = archived.filter(e => e.id !== id);
    setArchived(next);
    sessionStorage.setItem('hrms_archived', JSON.stringify(next));

    // add back to employees 
    const employees = JSON.parse(sessionStorage.getItem('hrms_employees') || '[]');
    const deduped = employees.filter(e => e.id !== toRestore.id);
    const nextEmployees = [toRestore, ...deduped];
    sessionStorage.setItem('hrms_employees', JSON.stringify(nextEmployees));
  };

  const handleDelete = id => {
    const next = archived.filter(e => e.id !== id);
    setArchived(next);
    sessionStorage.setItem('hrms_archived', JSON.stringify(next));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Archived employees</h2>
      {archived.length === 0 ? (
        <div style={{ padding: 20, color: '#6b7280' }}>No archived employees.</div>
      ) : (
        <div className={styles.cardGrid}>
          {archived.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} archived onRestore={() => handleRestore(emp.id)} onDelete={() => handleDelete(emp.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeArchive;
