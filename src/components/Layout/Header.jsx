import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../store/authSlice';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { FiMoon, FiSun } from 'react-icons/fi';

const Header = () => {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();

  const [theme, setTheme] = useState(() => localStorage.getItem('hrms_theme') || 'light');
  const settings = useSelector(s => s.settings || { siteName: 'HRMS', logoUrl: '' });

  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') body.classList.add('theme-dark'); else body.classList.remove('theme-dark');
    localStorage.setItem('hrms_theme', theme);
  }, [theme]);

  return (
    <header className={`${styles.header} ${theme === 'dark' ? styles.darkHeader : ''}`}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div className={styles.brand}>
          <Link to="/">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.siteName || 'logo'} style={{height:28, objectFit:'contain'}} />
            ) : (
              settings.siteName || 'HRMS'
            )}
          </Link>
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.themeBtn} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="toggle theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        {user ? (
          <>
            <div className={styles.user}>Signed in as <strong style={{marginLeft:6}}>{user.name}</strong></div>
            <button className={`${styles.btn} ${styles.logoutBtn}`} onClick={() => dispatch(clearUser())}>Logout</button>
          </>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
