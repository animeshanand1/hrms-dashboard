import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './LeavePolicies.module.css';

const initialPolicies = [
  {
    id: 1,
    title: 'Annual Leave Policy',
    category: 'Leave',
    effectiveDate: '2024-01-01',
    description:
      'Employees are entitled to 18 days of paid annual leave per year. Carry-over of unused days is limited to 5 days and requires manager approval.',
    url: ''
  },
  {
    id: 2,
    title: 'Sick Leave Policy',
    category: 'Leave',
    effectiveDate: '2023-06-15',
    description:
      'Employees may take paid sick leave up to 10 days per year. A doctor’s note is required for sick leave longer than 3 consecutive days.',
    url: ''
  },
  {
    id: 3,
    title: 'Remote Work Policy',
    category: 'Workplace',
    effectiveDate: '2022-09-01',
    description:
      'Defines expectations for remote work, equipment support, and communication norms while working offsite.',
    url: ''
  }
];

const LeavePolicies = () => {
  const user = useSelector((s) => s.auth.user);
  const role = user?.role || 'guest';
  const canManage = role === 'admin' || role === 'hr';

  const [policies, setPolicies] = useState(initialPolicies);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewing, setViewing] = useState(null);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({ title: '', category: 'Leave', effectiveDate: '', description: '', url: '' });

  const categories = useMemo(() => {
    const cats = new Set(policies.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [policies]);

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      const matchesSearch = [p.title, p.description, p.category]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [policies, search, category]);

  function openAdd() {
    if (!canManage) return;
    setForm({ title: '', category: 'Leave', effectiveDate: '', description: '', url: '' });
    setAdding(true);
  }

  function submitAdd(e) {
    e.preventDefault();
    if (!canManage) {
      setAdding(false);
      return;
    }
    const next = {
      id: Date.now(),
      title: form.title || 'Untitled Policy',
      category: form.category || 'General',
      effectiveDate: form.effectiveDate || new Date().toISOString().slice(0, 10),
      description: form.description || '',
      url: form.url || ''
    };
    setPolicies((s) => [next, ...s]);
    setAdding(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Company Policies</h2>
        <p className={styles.subtitle}>Browse and prototype company policies for HRMS.</p>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {canManage && (
          <button className={styles.primary} onClick={openAdd}>
            + New Policy
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {filtered.length === 0 && <li className={styles.empty}>No policies found.</li>}
        {filtered.map((p) => (
          <li key={p.id} className={styles.card}>
            <div className={styles.cardLeft}>
              <h3 className={styles.title}>{p.title}</h3>
              <div className={styles.meta}>
                <span className={styles.badge}>{p.category}</span>
                <span className={styles.date}>Effective: {p.effectiveDate}</span>
              </div>
              <p className={styles.excerpt}>{p.description.slice(0, 150)}{p.description.length>150? '...': ''}</p>
            </div>
            <div className={styles.cardRight}>
              <button className={styles.secondary} onClick={() => setViewing(p)}>
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      {viewing && (
        <div className={styles.modalBackdrop} onClick={() => setViewing(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{viewing.title}</h3>
            <div className={styles.metaRow}>
              <span className={styles.badge}>{viewing.category}</span>
              <span className={styles.date}>Effective: {viewing.effectiveDate}</span>
            </div>
            <p className={styles.description}>{viewing.description}</p>
            {viewing.url && (
              <p>
                <a href={viewing.url} target="_blank" rel="noreferrer">
                  Download
                </a>
              </p>
            )}
            <div className={styles.modalActions}>
              <button className={styles.primary} onClick={() => setViewing(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {adding && canManage && (
        <div className={styles.modalBackdrop} onClick={() => setAdding(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Create Policy</h3>
            <form onSubmit={submitAdd} className={styles.form}>
              <label>
                Title
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <label>
                Category
                <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              </label>
              <label>
                Effective Date
                <input type="date" value={form.effectiveDate} onChange={(e) => setForm((f) => ({ ...f, effectiveDate: e.target.value }))} />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
              <label>
                Link (optional)
                <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
              </label>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondary} onClick={() => setAdding(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primary}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePolicies;
