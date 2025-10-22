import React from 'react';

const Unauthorized = () => {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
      <div style={{textAlign:'center'}}>
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
