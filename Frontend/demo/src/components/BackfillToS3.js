// BackfillButton.js
import ProgressBar from './ProgressBar';

import React, { useState } from 'react';

const BackfillToS3 = ({ onBackfillComplete }) => {
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
        Backfill from Aurora to S3
      </button>
      <ProgressBar progress={backfillProgress} />
    </div>
  );
};

export default BackfillToS3;
