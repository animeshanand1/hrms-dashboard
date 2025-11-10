import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FiUsers, FiChevronDown, FiChevronRight, FiPlusCircle, FiArchive, FiList, FiFileText, FiUserPlus } from 'react-icons/fi';
import { FiCalendar, FiClock, FiBook, FiSettings, FiDollarSign } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Sidebar = ({ collapsed = false, setCollapsed = () => { }, mobileOpen = false, setMobileOpen = () => { } }) => {
  const [employeeOpen, setEmployeeOpen] = useState(true);
  const [leaveOpen, setLeaveOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [payrollOpen, setPayrollOpen] = useState(false);
  const appSettings = useSelector(s => s.settings || { siteName: 'HRMS Dashboard', logoUrl: '' });
  const loc = useLocation();
  const user = useSelector(s => s.auth.user);

  const isActive = (path) => loc.pathname === path;

  const onToggle = () => setCollapsed(s => !s);

  return (
    <>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            {appSettings.logoUrl ? (
              <img src={appSettings.logoUrl} alt={appSettings.siteName} style={{ height: 28, objectFit: 'contain' }} />
            ) : (
              'HR'
            )}
          </div>
          {!collapsed && <div className={styles.brandText}>{appSettings.siteName || 'HRMS Dashboard'}</div>}
          <button className={styles.toggleBtn} onClick={onToggle} aria-label="Toggle sidebar">{collapsed ? '›' : '‹'}</button>
        </div>

        {user && (
          <div style={{ padding: 8, paddingLeft: 12 }}>
            <Link to={`/employee/${user.id}`} className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.image ? (
                  <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>{(user.name || '')[0]}</div>
                )}
              </div>
              {!collapsed && <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{user.name}</div>}
            </Link>
          </div>
        )}

        <nav className={styles.menu}>
          {/* Employee admin section - only visible to admin and hr roles */}
          {user && user.role !== 'employee' && (
            <div className={styles.menuSection}>
              <div className={styles.sectionHeader} onClick={() => setEmployeeOpen(s => !s)}>
                <div className={styles.sectionTitle}><FiUsers />{!collapsed && <span>Employee</span>}</div>
                {!collapsed && <div>{employeeOpen ? <FiChevronDown /> : <FiChevronRight />}</div>}
              </div>

              {employeeOpen && (
                <div className={styles.submenu}>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/create-employee') ? styles.active : ''}`} to="/admin/create-employee"><FiPlusCircle /> {!collapsed && 'Add employee'}</Link></div>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/employees') ? styles.active : ''}`} to="/admin/employees"><FiList /> {!collapsed && 'List employees'}</Link></div>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/archive') ? styles.active : ''}`} to="/admin/archive"><FiArchive /> {!collapsed && 'Archive'}</Link></div>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/payslips') ? styles.active : ''}`} to="/admin/payslips"><FiFileText /> {!collapsed && 'Payslips'}</Link></div>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/attendance') ? styles.active : ''}`} to="/admin/attendance"><FiCalendar /> {!collapsed && 'Attendance Records'}</Link></div>
                </div>
              )}
            </div>
          )}

          {/* Talent Acquisition - visible to admin and hr */}
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <div className={styles.menuSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}><FiUserPlus />{!collapsed && <span>Talent Acquisition</span>}</div>
              </div>

              <div className={styles.submenu}>
                <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/talent/jobs') ? styles.active : ''}`} to="/talent/jobs"><FiList /> {!collapsed && 'Job Openings'}</Link></div>
                <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/talent/pipeline') ? styles.active : ''}`} to="/talent/pipeline"><FiClock /> {!collapsed && 'Candidate Pipeline'}</Link></div>
                <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/talent/onboarding') ? styles.active : ''}`} to="/talent/onboarding"><FiFileText /> {!collapsed && 'Onboarding'}</Link></div>
              </div>
            </div>
          )}

          <div className={styles.menuSection}>
            <div className={styles.sectionHeader} onClick={() => setLeaveOpen(s => !s)}>
              <div className={styles.sectionTitle}><FiCalendar />{!collapsed && <span>Leave</span>}</div>
              {!collapsed && <div>{leaveOpen ? <FiChevronDown /> : <FiChevronRight />}</div>}
            </div>

            {leaveOpen && (
              <div className={styles.submenu}>
                <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/leave/requests') ? styles.active : ''}`} to="/leave/requests"><FiClock /> {!collapsed && 'Leave requests'}</Link></div>
                <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/leave/attendance') ? styles.active : ''}`} to="/leave/attendance"><FiCalendar /> {!collapsed && 'Attendance'}</Link></div>
                <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/leave/policies') ? styles.active : ''}`} to="/leave/policies"><FiBook /> {!collapsed && 'Policies'}</Link></div>
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/leave/calendar') ? styles.active : ''}`} to="/leave/calendar"><FiCalendar /> {!collapsed && 'Calendar Management'}</Link></div>
                )}
                {user?.role === 'employee' && (
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/my/monthly-summary') ? styles.active : ''}`} to="/my/monthly-summary"><FiFileText /> {!collapsed && 'Monthly Summary'}</Link></div>
                )}
              </div>
            )}
          </div>

          {user?.role === 'admin' && (
            <div className={styles.menuSection}>
              <div className={styles.sectionHeader} onClick={() => setSettingsOpen(s => !s)}>
                <div className={styles.sectionTitle}><FiSettings />{!collapsed && <span>Settings</span>}</div>
                {!collapsed && <div>{settingsOpen ? <FiChevronDown /> : <FiChevronRight />}</div>}
              </div>

              {settingsOpen && (
                <div className={styles.submenu}>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/settings') ? styles.active : ''}`} to="/admin/settings"><FiSettings /> {!collapsed && 'General Settings'}</Link></div>
                </div>
              )}
            </div>
          )}

          <div className={styles.menuSection}>
            <div className={styles.sectionHeader} onClick={() => setPayrollOpen ? setPayrollOpen(s => !s) : null}>
              <div className={styles.sectionTitle}><FiDollarSign />{!collapsed && <span>Payroll</span>}</div>
              {!collapsed && <div>{typeof payrollOpen !== 'undefined' && (payrollOpen ? <FiChevronDown /> : <FiChevronRight />)}</div>}
            </div>

            {typeof payrollOpen !== 'undefined' && payrollOpen && (
              <div className={styles.submenu}>
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <>
                    <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/payroll/generate') ? styles.active : ''}`} to="/payroll/generate"><FiDollarSign /> {!collapsed && 'Salary generation'}</Link></div>
                    <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/payroll/manage') ? styles.active : ''}`} to="/payroll/manage"><FiList /> {!collapsed && 'Manage employee salary'}</Link></div>
                  </>
                )}

                {/* allow employees to access the read-only payslips view */}
                {user?.role === 'employee' && (
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/payslips') ? styles.active : ''}`} to="/admin/payslips"><FiFileText /> {!collapsed && 'My Payslips'}</Link></div>
                )}
              </div>
            )}
          </div>

        </nav>
      </aside>

      {/* mobile backdrop */}
      {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />}
    </>
  );
};

export default Sidebar;
