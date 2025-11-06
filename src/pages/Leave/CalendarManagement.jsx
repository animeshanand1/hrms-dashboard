import React, { useState, useEffect } from 'react';
import { FiCalendar, FiSave, FiTrash2 } from 'react-icons/fi';
import Calendar from '../../components/Calendar/Calendar';
import styles from './CalendarManagement.module.css';

const CalendarManagement = () => {
  const [customHolidays, setCustomHolidays] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hrms_custom_holidays') || '[]');
    } catch {
      return [];
    }
  });

  const [newHoliday, setNewHoliday] = useState({
    date: '',
    name: '',
    type: 'public' 
  });

  const [workingDays, setWorkingDays] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hrms_working_days') || '[1,2,3,4,5]');
    } catch {
      return [1, 2, 3, 4, 5]; 
    }
  });

  useEffect(() => {
    sessionStorage.setItem('hrms_custom_holidays', JSON.stringify(customHolidays));
  }, [customHolidays]);

  useEffect(() => {
    sessionStorage.setItem('hrms_working_days', JSON.stringify(workingDays));
  }, [workingDays]);

  const handleAddHoliday = (e) => {
    e.preventDefault();
    if (!newHoliday.date || !newHoliday.name) return;

    setCustomHolidays(prev => [
      ...prev,
      {
        ...newHoliday,
        id: Date.now().toString()
      }
    ]);

    setNewHoliday({
      date: '',
      name: '',
      type: 'public'
    });
  };

  const handleDeleteHoliday = (id) => {
    setCustomHolidays(prev => prev.filter(h => h.id !== id));
  };

  const toggleWorkingDay = (day) => {
    setWorkingDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      }
      return [...prev, day].sort();
    });
  };

  const daysOfWeek = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Calendar Management</h1>
        <p>Configure working days and holidays for the organization</p>
      </div>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          {/* Working Days Configuration */}
          <div className={styles.section}>
            <h2>Working Days</h2>
            <div className={styles.workingDays}>
              {daysOfWeek.map(day => (
                <button
                  key={day.id}
                  className={`${styles.dayButton} ${workingDays.includes(day.id) ? styles.active : ''}`}
                  onClick={() => toggleWorkingDay(day.id)}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          {/* Holiday Management */}
          <div className={styles.section}>
            <h2>Add Holiday</h2>
            <form onSubmit={handleAddHoliday} className={styles.holidayForm}>
              <div className={styles.formGroup}>
                <label>Date:</label>
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={e => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Holiday Name:</label>
                <input
                  type="text"
                  value={newHoliday.name}
                  onChange={e => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter holiday name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Type:</label>
                <select
                  value={newHoliday.type}
                  onChange={e => setNewHoliday(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="public">Public Holiday</option>
                  <option value="company">Company Holiday</option>
                  <option value="optional">Optional Holiday</option>
                </select>
              </div>

              <button type="submit" className={styles.addButton}>
                <FiSave /> Add Holiday
              </button>
            </form>
          </div>

          {/* Holiday List */}
          <div className={styles.section}>
            <h2>Holiday List</h2>
            <div className={styles.holidayList}>
              {customHolidays.map(holiday => (
                <div key={holiday.id} className={styles.holidayItem}>
                  <div className={styles.holidayInfo}>
                    <div className={styles.holidayDate}>
                      <FiCalendar />
                      {new Date(holiday.date).toLocaleDateString()}
                    </div>
                    <div className={styles.holidayName}>{holiday.name}</div>
                    <div className={styles.holidayType}>{holiday.type}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className={styles.deleteButton}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <Calendar adminView />
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;