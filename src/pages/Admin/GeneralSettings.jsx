import React, { useEffect, useState } from 'react';
import styles from './GeneralSettings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings as setSettingsAction } from '../../store/settingsSlice';

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const current = useSelector(s => s.settings);
  const [settings, setSettings] = useState(current || { siteName: 'HRMS Dashboard', logoUrl: '', tagline: 'People first' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (current) setSettings(current);
  }, [current]);

  const save = (e) => {
    e.preventDefault();
    dispatch(setSettingsAction(settings));
    setMessage('Settings saved');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettings(s => ({ ...s, logoUrl: reader.result }));
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className={styles.container}>
      <h2>General Settings</h2>
      <p className={styles.subtitle}>Update site name, logo and other basic settings.</p>

      <form className={styles.form} onSubmit={save}>
        <label>
          Site name
          <input value={settings.siteName} onChange={(e) => setSettings(s => ({ ...s, siteName: e.target.value }))} />
        </label>

        <label>
          Tagline
          <input value={settings.tagline} onChange={(e) => setSettings(s => ({ ...s, tagline: e.target.value }))} />
        </label>

        <label>
          Logo URL
          <input value={settings.logoUrl} onChange={(e) => setSettings(s => ({ ...s, logoUrl: e.target.value }))} placeholder="https://.../logo.png" />
        </label>

        <label>
          Upload logo (optional)
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>

        <div className={styles.actions}>
          <button className={styles.primary} type="submit">Save</button>
        </div>
        {message && <div className={styles.message}>{message}</div>}
      </form>

      <div className={styles.preview}>
        <h3>Preview</h3>
        <div className={styles.previewInner}>
          {settings.logoUrl ? <img src={settings.logoUrl} alt="logo" className={styles.logo} /> : <div className={styles.logoPlaceholder}>Logo</div>}
          <div>
            <div className={styles.previewName}>{settings.siteName}</div>
            <div className={styles.previewTag}>{settings.tagline}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
