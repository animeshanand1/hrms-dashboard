import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight, FiCheck, FiX, FiBriefcase } from 'react-icons/fi';
import styles from './Calendar.module.css';

const Calendar = () => {
  const user = useSelector(state => state.auth.user);
  const role = user?.role || 'guest';
  const isAdmin = role === 'admin' || role === 'hr';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [customHolidays, setCustomHolidays] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hrms_custom_holidays') || '[]');
    } catch {
      return [];
    }
  });

  const [workingDays, setWorkingDays] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hrms_working_days') || '[1,2,3,4,5]');
    } catch {
      return [1, 2, 3, 4, 5]; // Monday to Friday by default
    }
  });
  const [attendance, setAttendance] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(`hrms_attendance_${user?.id}`) || '[]');
    } catch {
      return [];
    }
  });
  const [leaves, setLeaves] = useState(() => {
    try {
      // calendar expects an object mapping date -> leaveType
      const stored = sessionStorage.getItem(`hrms_leaves_${user?.id}`);
      if (stored) {
        return JSON.parse(stored || '{}') || {};
      }
      const alt = sessionStorage.getItem(`hrms_user_leaves_${user?.id}`);
      if (alt) {
        try {
          const arr = JSON.parse(alt || '[]') || [];

          const map = {};
          arr.forEach(item => {
            if (item && item.from && item.to) {
              const start = new Date(item.from);
              const end = new Date(item.to);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const ds = d.toISOString().slice(0, 10);
                map[ds] = item.reason || item.type || 'Leave';
              }
            }
          });
         
          sessionStorage.setItem(`hrms_leaves_${user?.id}`, JSON.stringify(map));
          return map;
        } catch (e) {
          console.error('Error parsing alt leaves', e);
          return {};
        }
      }

      return {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (customHolidays.length) {
      sessionStorage.setItem('hrms_custom_holidays', JSON.stringify(customHolidays));
    }
  }, [customHolidays]);

  useEffect(() => {
    if (workingDays.length) {
      sessionStorage.setItem('hrms_working_days', JSON.stringify(workingDays));
    }
  }, [workingDays]);

  useEffect(() => {
    if (user?.id && attendance.length) {
      sessionStorage.setItem(`hrms_attendance_${user.id}`, JSON.stringify(attendance));
    }
  }, [attendance, user?.id]);

  useEffect(() => {
    if (user?.id && Object.keys(leaves).length) {
      sessionStorage.setItem(`hrms_leaves_${user.id}`, JSON.stringify(leaves));
    }
  }, [leaves, user?.id]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDay: new Date(year, month, 1).getDay()
    };
  };

  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const isHoliday = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const day = date.getDay();

    // Check if it's a non-working day
    if (!workingDays.includes(day)) return true;

    // Check custom holidays
    return customHolidays.some(h => h.date === dateStr);
  };

  const isAttended = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendance.includes(dateStr);
  };

  const isOnLeave = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaves[dateStr];
  };

  const toggleHoliday = (date) => {
    if (!isAdmin) return;
    const dateStr = date.toISOString().split('T')[0];
    const day = date.getDay();

    // restrict toggling weekends
    if (day === 0 || day === 6) return;

    setCustomHolidays(prev => {
      const existingHoliday = prev.find(h => h.date === dateStr);
      if (existingHoliday) {
        return prev.filter(h => h.date !== dateStr);
      }
      return [...prev, {
        id: Date.now().toString(),
        date: dateStr,
        name: 'Custom Holiday',
        type: 'company'
      }];
    });
  };

  const markAttendance = (date) => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // Can only mark attendance for today
    if (date.getTime() !== today.getTime()) return;

    const dateStr = date.toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Get existing attendance details
    let attendanceDetails = [];
    try {
      attendanceDetails = JSON.parse(sessionStorage.getItem(`hrms_attendance_details_${user.id}`) || '[]');
    } catch (error) {
      console.error('Error loading attendance details:', error);
    }

    const todayRecord = attendanceDetails.find(record => record.date === dateStr);

    if (!todayRecord) {

      attendanceDetails.push({
        date: dateStr,
        employeeId: user.id,
        checkIn: currentTime,
        checkOut: null
      });
    } else if (!todayRecord.checkOut) {
      // Record exists but no check out - mark check out
      todayRecord.checkOut = currentTime;
    }

    // Save attendance details
    sessionStorage.setItem(
      `hrms_attendance_details_${user.id}`,
      JSON.stringify(attendanceDetails)
    );

    // Update attendance dates list
    if (!attendance.includes(dateStr)) {
      setAttendance(prev => [...prev, dateStr]);
    }
  };

  const getMonthStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;
    let attendedDays = 0;
    let holidayCount = 0;

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];

      if (isHoliday(date)) {
        holidayCount++;
      } else {
        workingDays++;
        if (attendance.includes(dateStr)) {
          attendedDays++;
        }
      }
    }

    // Count leave days
    let leaveDays = 0;
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      if (leaves[dateStr]) {
        leaveDays++;
      }
    }

    return { workingDays, attendedDays, holidayCount, leaveDays };
  };

  const renderCalendar = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={`${styles.day} ${styles.inactive}`} />
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.getTime() === today.getTime();
      const holiday = isHoliday(date) || date.getDay() === 0 || date.getDay() === 6; // force weekends as holidays
      const attended = isAttended(date);
      const onLeave = isOnLeave(date);

      days.push(
        <div
          key={i}
          className={`${styles.day} 
            ${isToday ? styles.today : ''} 
            ${holiday ? styles.holiday : ''} 
            ${attended ? styles.attended : ''}
            ${onLeave ? styles.leave : ''}`}
          onClick={() => {
            if (!holiday && !onLeave && !isAdmin && role === 'employee') {
              markAttendance(date);
            }
          }}
        >
          <span className={styles.dayNumber}>{i}</span>
          {attended && !onLeave && (
            <div className={styles.attendanceIcon}>
              <FiCheck />
            </div>
          )}
          {holiday && (
            <div className={styles.holidayIcon}>
              <FiX />
              {customHolidays.find(h => h.date === date.toISOString().split('T')[0])?.name && (
                <span className={styles.holidayName}>
                  {customHolidays.find(h => h.date === date.toISOString().split('T')[0]).name}
                </span>
              )}
            </div>
          )}
          {onLeave && (
            <div className={styles.leaveIcon}>
              <FiBriefcase />
              <span className={styles.leaveType}>{leaves[date.toISOString().split('T')[0]]}</span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const stats = getMonthStats();

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.header}>
        <div className={styles.monthSelector}>
          <button className={styles.navigationBtn} onClick={prevMonth}>
            <FiChevronLeft />
          </button>
          <h2 className={styles.monthTitle}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button className={styles.navigationBtn} onClick={nextMonth}>
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.calendar + ' ' + styles.calendarScrollable}>
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        {/* Calendar days */}
        {renderCalendar()}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: '#22c55e' }} />
          <span>Present</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: '#ef4444' }} />
          <span>Holiday</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ background: '#8b5cf6' }} />
          <span>On Leave</span>
        </div>
      </div>

      {isAdmin && (
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Monthly Summary</h3>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Working Days</div>
              <div className={styles.statValue}>{stats.workingDays}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Days Present</div>
              <div className={styles.statValue}>{stats.attendedDays}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Holidays</div>
              <div className={styles.statValue}>{stats.holidayCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Days on Leave</div>
              <div className={styles.statValue}>{stats.leaveDays}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Attendance %</div>
              <div className={styles.statValue}>
                {stats.workingDays ? Math.round(((stats.attendedDays + stats.leaveDays) / stats.workingDays) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className={styles.adminControls}>
          <h3 className={styles.adminTitle}>Holiday Management</h3>
          <p>Click on any non-weekend day to toggle it as a holiday.</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
