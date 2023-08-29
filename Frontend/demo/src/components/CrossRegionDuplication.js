// BackfillButton.js
import ProgressBarOhio from './ProgressBarOhio';
import React, { useState } from 'react';

const CrossRegionDuplication = ({ onBackfillComplete }) => {
  const [backfillProgress, setBackfillProgress] = useState(0);

  const handleBackfillClick = () => {
    setBackfillProgress(0);
    const interval = setInterval(() => {
      setBackfillProgress(prevProgress => {
        if (prevProgress < 100) {
            return prevProgress + 10;
          } else {
            clearInterval(interval);
            return prevProgress;
          }
      });
      
    }, 500);
  };

  return (
    <div>
      <button className="App-button" onClick={handleBackfillClick}>
        Cross Region Duplication
      </button>
      <ProgressBarOhio progress={backfillProgress} />
    </div>
  );
};

export default CrossRegionDuplication;
