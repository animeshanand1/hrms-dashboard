import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../store/authSlice';
import { Link } from 'react-router-dom';

const Header = () => {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();

  return (
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 24px',background:'#fff',borderBottom:'1px solid #eee'}}>
      <div><Link to="/">HRMS</Link></div>
      <div>
        {user ? (
          <>
            <span style={{marginRight:12}}>Signed in as {user.name} ({user.role})</span>
            <button onClick={() => dispatch(clearUser())}>Logout</button>
          </>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
