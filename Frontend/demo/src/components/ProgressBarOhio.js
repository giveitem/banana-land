const ProgressBarOhio = ( { progress } ) => {
  return (
    <div style={{border: '1px solid white', margin: '10px', padding:'10px'}}>
      <p>US West (Ohio)</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <progress value={progress} max="100"></progress>
      <p style={{ margin: 0 }}>{progress}%</p>
    </div>
    </div>
    

  );
};

export default ProgressBarOhio;
