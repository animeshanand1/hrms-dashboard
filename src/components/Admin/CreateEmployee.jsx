import React, { useState } from 'react';
import styles from '../Auth/LoginPage.module.css';
import adminStyles from './CreateEmployee.module.css';

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
    salary: '',
    probationMonths: '',
    password: '',
    sendInvite: true,
    autoGeneratePassword: true,
  });

  const [created, setCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call admin API to create employee and send invite email
    console.log('Creating employee:', form);
    setCreated(true);
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
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.email ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="email">Work email</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} required />
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

                  <div className={`${adminStyles.inputGroup} ${form.salary ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="salary">Salary (annual)</label>
                      <input id="salary" name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.probationMonths ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="probationMonths">Probation period (months)</label>
                      <input id="probationMonths" name="probationMonths" type="number" value={form.probationMonths} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.password ? adminStyles.filledGroup : ''}`}>
                    <div className={adminStyles.inputWrapper}>
                      <label className={adminStyles.floatingLabel} htmlFor="password">Temporary password</label>
                      <input id="password" name="password" type="text" value={form.password} onChange={handleChange} placeholder="" className={`${adminStyles.inputField} ${adminStyles.fullWidthInput} ${adminStyles.padForLegend}`} />
                    </div>
                  </div>

                  <div className={`${adminStyles.inputGroup} ${form.autoGeneratePassword ? adminStyles.filledGroup : ''}`}>
                    <label>
                      <input type="checkbox" name="autoGeneratePassword" checked={form.autoGeneratePassword} onChange={(e) => setForm(prev => ({...prev, autoGeneratePassword: e.target.checked}))} />
                      <span>Auto-generate password</span>
                    </label>
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
