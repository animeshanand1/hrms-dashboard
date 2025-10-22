
import React,{ useState } from 'react';

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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Quick demo sign-in for testing routes 
  const demoLogin = (role) => {
    const user = demoUsers[role];
    if (!user) return;
    dispatch(setUser(user));
    // navigate to admin dashboard if admin
    if (user.role === 'admin') navigate('/admin/create-employee');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <aside className={styles.leftPanel}>
          <div className={styles.brandWrapper}>
            <div className={styles.brandIcon}>
              <FaBuilding size={48} />
            </div>
            <h2 className={styles.brandTitle}>Your Company</h2>
            <p className={styles.brandSubtitle}>People-first HR management</p>
          </div>
        </aside>

        <main className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <div className={styles.logo}></div>
              <span className={styles.logoText}>HRMS</span>
            </div>

            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to your HRMS dashboard</p>

            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <button type="button" onClick={() => demoLogin('admin')} className="btn">Demo Admin</button>
              <button type="button" onClick={() => demoLogin('hr')} className="btn">Demo HR</button>
              <button type="button" onClick={() => demoLogin('employee')} className="btn">Demo Employee</button>
            </div>

            <form>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Work email</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiMail size={16} />
                  </span>
                  <input type="email" id="email" name="email" placeholder="name@company.com" className={`${styles.inputField} px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500`} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiLock size={16} />
                  </span>
                  <input type={passwordVisible ? "text" : "password"} id="password" name="password" placeholder="••••••••" className={`${styles.inputField} px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500`} />
                  <span className={styles.visibilityIcon} onClick={togglePasswordVisibility}>
                    {passwordVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </span>
                </div>
              </div>

              <div className={styles.options}>
                <div className={styles.rememberMe}>
                  <input type="checkbox" id="remember" name="remember" />
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