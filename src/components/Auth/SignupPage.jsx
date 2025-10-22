import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call signup API
    setSubmitted(true);
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

            <h1 className={styles.title}>Create an account</h1>
            <p className={styles.subtitle}>Register to access your HR dashboard.</p>

            {submitted ? (
              <div className={styles.supportText}>Thanks — check your email to confirm your account.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full name</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={`${styles.inputField} ${styles.fullWidthInput}`}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">Work email</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}><FiMail size={16} /></span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={`${styles.inputField} ${styles.fullWidthInput}`}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}><FiLock size={16} /></span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Choose a secure password"
                      className={`${styles.inputField} ${styles.fullWidthInput}`}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.signInButton}>Sign up</button>
              </form>
            )}

            <p className={`${styles.supportText} ${styles.compactSupport}`}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignupPage;
