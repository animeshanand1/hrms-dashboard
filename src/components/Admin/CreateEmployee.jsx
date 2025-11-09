import React, { useState } from 'react';
import styles from '../Auth/LoginPage.module.css';
import adminStyles from './CreateEmployee.module.css';
import employeesData from '../../data/employees.json';

const CreateEmployee = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    role: 'employee',
    department: '',
    jobTitle: '',
    manager: '',
    employmentType: 'full-time',
    location: '',
    phone: '',
    address: '',
    startDate: '',
    probationMonths: '',
    password: '',
    sendInvite: true,
    picture: '',
  });

  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, picture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // --- sanitization & validation helpers ---
  const stripTags = (s) => (s && typeof s === 'string') ? s.replace(/<[^>]*>/g, '') : s;
  const sanitizeString = (s) => {
    if (s === undefined || s === null) return '';
    return stripTags(String(s)).trim().replace(/\s+/g, ' ');
  };

  const isValidEmail = (s) => {
    if (!s) return false;
    // email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  };

  const isValidDate = (d) => {
    if (!d) return false;
    const dt = new Date(d);
    return !Number.isNaN(dt.getTime());
  };

  const sanitizeForm = (raw) => {
    return {
      fullName: sanitizeString(raw.fullName),
      email: sanitizeString(raw.email).toLowerCase(),
      employeeId: sanitizeString(raw.employeeId),
      role: sanitizeString(raw.role),
      department: sanitizeString(raw.department),
      jobTitle: sanitizeString(raw.jobTitle),
      manager: sanitizeString(raw.manager),
      employmentType: sanitizeString(raw.employmentType),
      location: sanitizeString(raw.location),
      phone: sanitizeString(raw.phone),
      address: sanitizeString(raw.address),
      startDate: sanitizeString(raw.startDate),
      probationMonths: sanitizeString(raw.probationMonths),
      password: sanitizeString(raw.password),
      sendInvite: !!raw.sendInvite,
      picture: raw.picture || ''
    };
  };

  const validateForm = (s) => {
    const errs = {};
    if (!s.fullName || s.fullName.length < 2) errs.fullName = 'Please enter a valid full name';
    if (!s.email) errs.email = 'Email is required';
    else if (!isValidEmail(s.email)) errs.email = 'Enter a valid email address';
    if (s.probationMonths) {
      const pm = parseInt(s.probationMonths, 10);
      if (Number.isNaN(pm) || pm < 0) errs.probationMonths = 'Enter a valid number of months';
    }
    if (s.startDate && !isValidDate(s.startDate)) errs.startDate = 'Start date is invalid';
    if (s.password && s.password.length > 0 && s.password.length < 6) errs.password = 'Password must be at least 6 characters';
    // sanitize phone to allow only digits and common symbols
    if (s.phone && !/^\+?[0-9 ()-]{6,20}$/.test(s.phone)) errs.phone = 'Enter a valid phone number';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // sanitize data
    const sanitized = sanitizeForm(form);
    const validation = validateForm(sanitized);
    if (Object.keys(validation).length) {
      setErrors(validation);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const existing = JSON.parse(sessionStorage.getItem('hrms_employees')) || employeesData || [];

    const genId = () => {
      if (form.employeeId) return form.employeeId;
      
      const nums = existing.map(e => {
        const m = (e.id || '').match(/(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      });
      const max = nums.length ? Math.max(...nums) : 0;
      return `EMP${String(max + 1).padStart(3, '0')}`;
    };

    const newEmp = {
      id: genId(),
      name: sanitized.fullName || 'New Employee',
      designation: sanitized.jobTitle || '',
      department: sanitized.department || '',

      hiredDate: sanitized.startDate || '',
      startDate: sanitized.startDate || '',
      email: sanitized.email || '',
      phone: sanitized.phone || '',
      // employment details
      jobType: sanitized.employmentType || '',
      employmentType: sanitized.employmentType || '',
      manager: sanitized.manager || '',
      location: sanitized.location || '',
      address: sanitized.address || '',
      role: sanitized.role || 'employee',
      picture: sanitized.picture || `https://i.pravatar.cc/150?u=${Date.now()}`,
      
      password: sanitized.password || '',
 
    };

    if (!newEmp.password) {
      const temp = Math.random().toString(36).slice(-8);
      newEmp.password = temp;
      
      console.log('Temporary password for new employee:', newEmp.email, temp);
    }

    const updated = [newEmp, ...existing];
    sessionStorage.setItem('hrms_employees', JSON.stringify(updated));
    console.log('Created employee (saved to session):', newEmp);
    setCreated(true);
  
    setErrors({});
    setForm(prev => ({ ...prev, fullName: '', email: '', employeeId: '', jobTitle: '', department: '', startDate: '', picture: '' }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.rightPanel}>
          <div className={adminStyles.formContainer}>
            <div className={adminStyles.header}>
              <div className={adminStyles.logo}></div>
              <span className={adminStyles.logoText}>HRMS Admin</span>
            </div>

            <h1 className={adminStyles.title}>Create employee</h1>
            <p className={adminStyles.subtitle}>Create an employee account and optionally send a welcome email with sign-in details.</p>

            {created ? (
              <div className={styles.supportText}>Employee created successfully. You can create another or view employees.</div>
            ) : (
              <form onSubmit={handleSubmit} className={adminStyles.horizontalForm}>
                <div className={adminStyles.horizontalGrid}>
                  <div className={`${adminStyles.inputGroup} ${form.fullName ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="fullName">Full name</label>
                      <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} required />
                      {errors.fullName && <div className={adminStyles.fieldError}>{errors.fullName}</div>}
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.picture ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="picture"></label>
                      <input id="picture" name="picture" type="file" accept="image/*" onChange={handleFileChange} className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                      {form.picture && <img src={form.picture} alt="preview" style={{marginTop:8, width:84, height:84, borderRadius:10, objectFit:'cover'}} />}
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.email ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="email">Work email</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} required />
                      {errors.email && <div className={adminStyles.fieldError}>{errors.email}</div>}
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.employeeId ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="employeeId">Employee ID</label>
                      <input id="employeeId" name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.jobTitle ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="jobTitle">Job title</label>
                      <input id="jobTitle" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.department ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="department">Department</label>
                      <input id="department" name="department" value={form.department} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.role ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="role">Role</label>
                      <select id="role" name="role" value={form.role} onChange={handleChange} className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`}>
                        <option value="employee">Employee</option>
                        <option value="hr">HR</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.manager ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="manager">Manager</label>
                      <input id="manager" name="manager" value={form.manager} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${adminStyles.filledGroup}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="startDate">Start date</label>
                      <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                      {errors.startDate && <div className={adminStyles.fieldError}>{errors.startDate}</div>}
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.employmentType ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="employmentType">Employment type</label>
                      <select id="employmentType" name="employmentType" value={form.employmentType} onChange={handleChange} className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`}>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contractor">Contractor</option>
                      </select>
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.phone ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="phone">Phone</label>
                      <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                      {errors.phone && <div className={adminStyles.fieldError}>{errors.phone}</div>}
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.location ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="location">Location</label>
                      <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.address ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="address">Address</label>
                      <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  {/* Salary removed from create employee form */}

                  <div className={`${adminStyles.inputGroup} ${form.probationMonths ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="probationMonths">Probation period (months)</label>
                      <input id="probationMonths" name="probationMonths" type="number" value={form.probationMonths} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                      {errors.probationMonths && <div className={adminStyles.fieldError}>{errors.probationMonths}</div>}
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.password ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="password">Temporary password</label>
                      <input id="password" name="password" type="text" value={form.password} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                      {errors.password && <div className={adminStyles.fieldError}>{errors.password}</div>}
                    </div>
                  </div>

                
                  <div className={`${adminStyles.inputGroup} ${form.sendInvite ? adminStyles.filledGroup : ''}`}>
                    <label>
                      <input type="checkbox" name="sendInvite" checked={form.sendInvite} onChange={(e) => setForm(prev => ({...prev, sendInvite: e.target.checked}))} /> Send invitation email
                    </label>
                  </div>

                  <div className={adminStyles.inputGroup} style={{gridColumn: '1 / -1'}}>
                    <button type="submit" className={adminStyles.signInButton}>Create employee</button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateEmployee;
