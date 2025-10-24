import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiSearch, FiFilter, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './AttendenceList.module.css';
const AttendanceList = () => {
  const user = useSelector(state => state.auth.user);
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    try {
      const employeesData = JSON.parse(sessionStorage.getItem('hrms_employees') || '[]');
      console.log('Admin view - Loaded employees:', employeesData);
      setEmployees(employeesData);

      // Debug: List all sessionStorage keys and their contents
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        keys.push(key);
        if (key.includes('attendance')) {
          console.log(`Content for ${key}:`, sessionStorage.getItem(key));
        }
      }
      console.log('Available sessionStorage keys:', keys);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }, []);

  useEffect(() => {
    const allAttendance = [];
    
    // First try the direct attendance key
    try {
      const directAttendance = JSON.parse(sessionStorage.getItem('hrms_attendance_details_u_employee') || '[]');
      if (directAttendance.length > 0) {
        console.log('Found direct attendance records:', directAttendance);
        allAttendance.push(...directAttendance);
      }
    } catch (error) {
      console.error('Error loading direct attendance:', error);
    }

    // Then check for each employee
    employees.forEach(emp => {
      try {
        console.log('Checking attendance for employee:', emp.id);
        // Try both possible key formats
        const possibleKeys = [
          `hrms_attendance_details_${emp.id}`,
          `hrms_attendance_${emp.id}`,
          `hrms_attendance_details_u_${emp.id}`
        ];

        possibleKeys.forEach(key => {
          const storedAttendance = sessionStorage.getItem(key);
          if (storedAttendance) {
            console.log(`Found attendance data for key ${key}:`, storedAttendance);
            const empAttendance = JSON.parse(storedAttendance);
            allAttendance.push(
              ...empAttendance.map(record => ({
                ...record,
                employeeName: emp.name || 'Unknown',
                employeeEmail: emp.email || '',
                employeeId: emp.id
              }))
            );
          }
        });
      } catch (error) {
        console.error(`Error loading attendance for employee ${emp.id}:`, error);
      }
    });
    console.log('Setting attendance data:', allAttendance);
    setAttendanceData(allAttendance);
  }, [employees]);

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = !searchQuery || 
      (record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       record.employeeEmail?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // If no dates are selected, show all records
    if (!dateFilter.start && !dateFilter.end) return matchesSearch;
    
    const recordDate = new Date(record.date);
    const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
    const endDate = dateFilter.end ? new Date(dateFilter.end) : null;
    
    startDate?.setHours(0, 0, 0, 0);
    endDate?.setHours(23, 59, 59, 999);
    recordDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    const matchesDate = (!startDate || recordDate >= startDate) &&
                       (!endDate || recordDate <= endDate);
    
    return matchesSearch && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAttendance.length / recordsPerPage);
  const paginatedData = filteredAttendance.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present': return styles.statusPresent;
      case 'Absent': return styles.statusAbsent;
      case 'Pending': return styles.statusPending;
      case 'Leave': return styles.statusLeave;
      default: return '';
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const startTime = new Date(`2000-01-01T${checkIn}`);
    const endTime = new Date(`2000-01-01T${checkOut}`);
    const diffMs = endTime - startTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Attendance Records</h1>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by employee name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.dateFilter}>
          <input
            type="date"
            value={dateFilter.start}
            onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
            className={styles.dateInput}
          />
          <span>to</span>
          <input
            type="date"
            value={dateFilter.end}
            onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
            className={styles.dateInput}
          />
        </div>
      </div>

      <div className={styles.table}>
        <table>
          <thead className={styles.tableHeader}>
            <tr>
              <th><FiUser /> Employee</th>
              <th><FiCalendar /> Date</th>
              <th><FiClock /> Check In</th>
              <th><FiClock /> Check Out</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {paginatedData.map((record, index) => (
              <tr key={`${record.employeeId}-${record.date}-${index}`} className={styles.tableRow}>
                <td>
                  <div className={styles.avatarCell}>
                    <div className={styles.employeeInfo}>
                      <span className={styles.employeeName}>{record.employeeName}</span>
                      <span className={styles.employeeEmail}>{record.employeeEmail}</span>
                    </div>
                  </div>
                </td>
                <td>{new Date(record.date).toLocaleDateString(undefined, { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</td>
                <td className={styles.timeCell}>{formatTime(record.checkIn)}</td>
                <td className={styles.timeCell}>{formatTime(record.checkOut)}</td>
                <td>{calculateDuration(record.checkIn, record.checkOut)}</td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(record.status)}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Showing {Math.min(recordsPerPage, filteredAttendance.length)} of {filteredAttendance.length} records
          </span>
          <div className={styles.paginationButtons}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.active : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
