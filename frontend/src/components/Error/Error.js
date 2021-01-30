import React from 'react';

const error = () => {
  console.log('error chala');
  return (
    <div
      style={{ backgroundColor: 'pink', textAlign: 'center', padding: '20px' }}>
      Some error occurred!!
    </div>
  );
};

export default error;
