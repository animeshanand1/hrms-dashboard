
import React,{ useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styles from './LoginPage.module.css';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import demoUsers from '../../data/demoUsers.json';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // load remembered credentials on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hrms_remember');
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.email) setEmail(obj.email || '');
        if (obj && obj.password) setPassword(obj.password || '');
        setRemember(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Quick demo sign-in for testing routes 
  const demoLogin = (role) => {
    const user = demoUsers[role];
    if (!user) return;
    
    if (!user.id) user.id = `u_${role}_${Date.now()}`;
    dispatch(setUser(user));
    // navigate based on role
  if (user.role === 'admin') navigate('/admin/create-employee');
  else if (user.role === 'hr') navigate('/admin/employees');
    else navigate('/my/monthly-summary');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = (email || '').toLowerCase().trim();
    const targetPassword = password || '';

    // check session-stored employees first (created by admin)
    const stored = JSON.parse(sessionStorage.getItem('hrms_employees')) || [];
    const match = stored.find(u => (u.email || '').toLowerCase() === targetEmail);

    if (match) {
      
      if (match.password && match.password.length > 0) {
        if (match.password === targetPassword) {
          // ensure id exists
          if (!match.id) match.id = `EMP_${Date.now()}`;
          dispatch(setUser({ id: match.id, name: match.name, email: match.email, role: match.role || 'employee', department: match.department, image: match.picture }));
          // persist credentials if requested
          try {
            if (remember) {
              localStorage.setItem('hrms_remember', JSON.stringify({ email: match.email, password: match.password }));
            } else {
              localStorage.removeItem('hrms_remember');
            }
          } catch (err) { console.error('Storage error', err); }

          if (match.role === 'admin') navigate('/admin/create-employee');
          else if (match.role === 'hr') navigate('/admin/employees');
          else navigate('/my/monthly-summary');
          return;
        }
        setError('Invalid email or password');
        return;
      }

      if (!match.password) {
        dispatch(setUser({ id: match.id || `EMP_${Date.now()}`, name: match.name, email: match.email, role: match.role || 'employee', department: match.department, image: match.picture }));
        // if user chose to remember, save email only (no password stored on record)
        try {
          if (remember) {
            localStorage.setItem('hrms_remember', JSON.stringify({ email: match.email, password: '' }));
          } else {
            localStorage.removeItem('hrms_remember');
          }
        } catch (err) { console.error('Storage error', err); }

        if (match.role === 'admin') navigate('/admin/create-employee');
        else if (match.role === 'hr') navigate('/admin/employees');
        else navigate('/my/monthly-summary');
        return;
      }

      setError('Invalid email or password');
      return;
    }

    setError('Invalid email or password');
  };
  const settings = useSelector(s => s.settings || { siteName: 'Your Company', logoUrl: '', tagline: 'People-first HR management' });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <aside className={styles.leftPanel}>
          <div className={styles.brandWrapper}>
            <div className={styles.brandIcon}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} style={{width:72,height:72,objectFit:'contain'}} />
              ) : (
                <FaBuilding size={48} />
              )}
            </div>
            <h2 className={styles.brandTitle}>{settings.siteName || 'Your Company'}</h2>
            <p className={styles.brandSubtitle}>{settings.tagline || 'People-first HR management'}</p>
          </div>
        </aside>

        <main className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <div className={styles.logo}>
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteName} style={{height:40,objectFit:'contain'}} />
                ) : null}
              </div>
              <span className={styles.logoText}>{settings.siteName || 'HRMS'}</span>
            </div>

            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to your HRMS dashboard</p>

            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <button type="button" onClick={() => demoLogin('admin')} className="btn">Demo Admin</button>
              <button type="button" onClick={() => demoLogin('hr')} className="btn">Demo HR</button>
              <button type="button" onClick={() => demoLogin('employee')} className="btn">Demo Employee</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Work email</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiMail size={16} />
                  </span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" placeholder="name@company.com" className={`${styles.inputField} px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500`} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiLock size={16} />
                  </span>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={passwordVisible ? "text" : "password"} id="password" name="password" placeholder="••••••••" className={`${styles.inputField} px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500`} />
                  <span className={styles.visibilityIcon} onClick={togglePasswordVisibility}>
                    {passwordVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </span>
                </div>
              </div>

              {error && <div style={{color:'var(--red, #e11d48)', marginBottom:8}}>{error}</div>}

              <div className={styles.options}>
                  <div className={styles.rememberMe}>
                    <input type="checkbox" id="remember" name="remember" checked={remember} onChange={(e) => {
                      const v = !!e.target.checked;
                      setRemember(v);
                      if (!v) {
                        try { localStorage.removeItem('hrms_remember'); } catch { }
                      }
                    }} />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                <Link to="/forgot" className={styles.forgotPassword}>Forgot password?</Link>
              </div>

              <button type="submit" className={`${styles.signInButton} bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600`}>Sign in</button>
            </form>

            <p className={styles.supportText}>Need help? <a href="#">Contact HR or IT support.</a></p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;