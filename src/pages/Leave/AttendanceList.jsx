import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiSearch, FiFilter, FiUser } from 'react-icons/fi';
import Calendar from '../../components/Calendar/Calendar';
import styles from './AttendanceList.module.css';
// For Employee
const AttendanceList = () => {
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  useEffect(() => {
    if (isAdmin) {
      try {
        const employeesData = JSON.parse(sessionStorage.getItem('employees') || '[]');
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    try {
      if (isAdmin) {

        const allRecords = [];
        employees.forEach(emp => {
          const empAttendance = JSON.parse(sessionStorage.getItem(`hrms_attendance_details_${emp.id}`) || '[]');
          allRecords.push(...empAttendance.map(record => ({ ...record, employeeName: emp.name })));
        });
        setAttendanceRecords(allRecords);
      } else {
        const records = JSON.parse(sessionStorage.getItem(`hrms_attendance_details_${user.id}`) || '[]');
        setAttendanceRecords(records);
      }
    } catch (error) {
      console.error('Error loading attendance records:', error);
    }
  }, [isAdmin, employees, user?.id]);

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesEmployee = selectedEmployee === 'all' || record.employeeId === selectedEmployee;
    const matchesSearch = isAdmin
      ? record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesDate = (!dateFilter.start || record.date >= dateFilter.start) &&
                       (!dateFilter.end || record.date <= dateFilter.end);
    return matchesEmployee && matchesSearch && matchesDate;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Attendance Management</h1>
        <p className={styles.welcome}>
          {isAdmin
            ? "View and manage employee attendance records"
            : `Welcome, ${user?.name}! Mark your daily attendance and view your attendance history.`}
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.filters}>
            {isAdmin && (
              <>
                <div className={styles.filterGroup}>
                  <label>Employee:</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="all">All Employees</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Search:</label>
                  <div className={styles.searchBox}>
                    <FiSearch />
                    <input
                      type="text"
                      placeholder="Search by employee name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
           
          </div>

          <div className={styles.attendanceTable}>
            <table>
              <thead>
                <tr>
                  {isAdmin && <th><FiUser /> Employee</th>}
                  <th><FiCalendar /> Date</th>
                  <th><FiClock /> Check In</th>
                  <th><FiClock /> Check Out</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={index}>
                    {isAdmin && <td>{record.employeeName}</td>}
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut || '-'}</td>
                    <td>
                      {record.checkOut
                        ? calculateDuration(record.checkIn, record.checkOut)
                        : '-'
                      }
                    </td>
                    <td className={getStatusClass(record)}>{getStatus(record)}</td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className={styles.noRecords}>
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isAdmin && (
          <div className={styles.sideSection}>
            <div className={styles.calendarWrapper}>
              <Calendar />
            </div>
          </div>
        )}

  {isAdmin && (
  <div className={`${styles.rightPanel} ${isAdmin ? styles.fullWidth : ''}`}>
          <div className={styles.filters}>
            {isAdmin && (
              <>
                <div className={styles.filterGroup}>
                  <label>Employee:</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="all">All Employees</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Search:</label>
                  <div className={styles.searchBox}>
                    <FiSearch />
                    <input
                      type="text"
                      placeholder="Search by employee name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div className={styles.filterGroup}>
              <label>Date Range:</label>
              <div className={styles.dateRange}>
                <input
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                />
                <span>to</span>
                <input
                  type="date"
                  value={dateFilter.end}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className={styles.summaryBox}>
            <div className={styles.sideDateRange}>
              <label>Date Range</label>
              <div className={styles.dateRange}>
                <input
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                />
                <span>to</span>
                <input
                  type="date"
                  value={dateFilter.end}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </div>
  </div>
  )}
      </div>
    </div>
  );
};

function calculateDuration(checkIn, checkOut) {
  const startTime = new Date(`2000-01-01T${checkIn}`);
  const endTime = new Date(`2000-01-01T${checkOut}`);
  const diffMs = endTime - startTime;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function getStatus(record) {
  if (!record.checkOut) return 'Pending Check-out';
  const duration = calculateDurationInMinutes(record.checkIn, record.checkOut);
  if (duration >= 480) return 'Full Day';
  if (duration >= 240) return 'Half Day';
  return 'Partial Day';
}

function calculateDurationInMinutes(checkIn, checkOut) {
  const startTime = new Date(`2000-01-01T${checkIn}`);
  const endTime = new Date(`2000-01-01T${checkOut}`);
  return (endTime - startTime) / (1000 * 60);
}

function getStatusClass(record) {
  const status = getStatus(record);
  switch (status) {
    case 'Full Day': return styles.statusFull;
    case 'Half Day': return styles.statusHalf;
    case 'Partial Day': return styles.statusPartial;
    default: return styles.statusPending;
  }
}

export default AttendanceList;