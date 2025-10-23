import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FiUsers, FiChevronDown, FiChevronRight, FiPlusCircle, FiArchive, FiList, FiFileText } from 'react-icons/fi';
import { FiCalendar, FiClock, FiBook } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Sidebar = ({ collapsed = false, setCollapsed = () => {}, mobileOpen = false, setMobileOpen = () => {} }) => {
  const [employeeOpen, setEmployeeOpen] = useState(true);
  const loc = useLocation();
  const user = useSelector(s => s.auth.user);

  const isActive = (path) => loc.pathname === path;

  const onToggle = () => setCollapsed(s => !s);

  return (
    <>
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
  <div className={styles.brand}>
        <div className={styles.brandLogo}>HR</div>
        {!collapsed && <div className={styles.brandText}>HRMS Dashboard</div>}
        <button className={styles.toggleBtn} onClick={onToggle} aria-label="Toggle sidebar">{collapsed ? '›' : '‹'}</button>
      </div>

      <nav className={styles.menu}>
        {/* Employee admin section - only visible to admin and hr roles */}
        {user && user.role !== 'employee' && (
          <div className={styles.menuSection}>
            <div className={styles.sectionHeader} onClick={() => setEmployeeOpen(s => !s)}>
              <div className={styles.sectionTitle}><FiUsers />{!collapsed && <span>Employee</span>}</div>
              {!collapsed && <div>{employeeOpen ? <FiChevronDown/> : <FiChevronRight/>}</div>}
            </div>

            {employeeOpen && (
              <div className={styles.submenu}>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/create-employee') ? styles.active : ''}`} to="/admin/create-employee"><FiPlusCircle /> {!collapsed && 'Add employee'}</Link></div>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/employees') ? styles.active : ''}`} to="/admin/employees"><FiList /> {!collapsed && 'List employees'}</Link></div>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/archive') ? styles.active : ''}`} to="/admin/archive"><FiArchive /> {!collapsed && 'Archive'}</Link></div>
                  <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/admin/payslips') ? styles.active : ''}`} to="/admin/payslips"><FiFileText /> {!collapsed && 'Payslips'}</Link></div>
                </div>
            )}
          </div>
        )}

        <div className={styles.menuSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><FiCalendar />{!collapsed && <span>Leave</span>}</div>
          </div>
          <div className={styles.submenu}>
            <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/leave/requests') ? styles.active : ''}`} to="/leave/requests"><FiClock /> {!collapsed && 'Leave requests'}</Link></div>
            <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/leave/attendance') ? styles.active : ''}`} to="/leave/attendance"><FiCalendar /> {!collapsed && 'Attendance'}</Link></div>
            <div className={styles.subItem}><Link className={`${styles.link} ${isActive('/leave/policies') ? styles.active : ''}`} to="/leave/policies"><FiBook /> {!collapsed && 'Policies'}</Link></div>
          </div>
        </div>

        {/* Additional sections that are likely essential */}
        <div className={styles.menuSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><span>Payroll</span></div>
          </div>
          {/* submenu for payroll could go here */}
        </div>

        <div className={styles.menuSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><span>Reports</span></div>
          </div>
        </div>

      </nav>
    </aside>

    {/* mobile backdrop */}
    {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />}
    </>
  );
};

export default Sidebar;
