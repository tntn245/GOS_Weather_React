import React from 'react';
import '../style/ProgressBar.css';

const ProgressBar = ({ loading }) => {
  return (
    <div className={`progress-bar ${loading ? 'visible' : 'hidden'}`}>
      <div className="bar"></div>
    </div>
  );
};

export default ProgressBar;
