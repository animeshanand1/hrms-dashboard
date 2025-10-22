import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your API
    setSent(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <div className={styles.logo}></div>
              <span className={styles.logoText}>HRMS</span>
            </div>

            <h1 className={styles.title}>Forgot password</h1>
            <p className={styles.subtitle}>Enter your work email and we'll send a link to reset your password.</p>

            {sent ? (
              <div className={styles.supportText}>
                Check your inbox. If the email exists, you'll receive a reset link shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Work email</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}><FiMail size={16} /></span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${styles.inputField} ${styles.fullWidthInput}`}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.signInButton}>Send reset link</button>
              </form>
            )}

            <p className={`${styles.supportText} ${styles.compactSupport}`}>
              Remembered? <Link to="/login">Back to sign in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForgotPassword;
