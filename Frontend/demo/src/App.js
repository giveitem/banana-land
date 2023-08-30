import './App.css';
import AuroraTable from './components/AuroraTable';
import BackfillToS3 from './components/BackfillToS3';
import CrossRegionDuplication from './components/CrossRegionDuplication';
import DynamoTable from './components/DynamoTable';
import Alert from 'react-bootstrap/Alert';
import { getChangeDBResult } from './fetcher.js'
import { useState } from 'react';
function App() {
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const load = () => {
    getChangeDBResult().then((res) => {
      setMessage(res);
      setShowAlert(true);
      console.log(res);
    })
  }
  return (
    <div className="App">
      {showAlert && (
        <>
          <Alert key="success" variant="success" onClose={() => setShowAlert(false)} dismissible>
            {message}
          </Alert>
        </>
      )}
      <div className="Table-container">
        <div className="Table">
          <h2>AuroraDB</h2>
          <button className="App-button" onClick={load}>Update Aurora Table</button>
          <AuroraTable />
        </div>
        <div className="Table">
          <h2>S3</h2>
          <BackfillToS3 />
          <CrossRegionDuplication />
          {/* <progress max="100"></progress>
          <progress max="100"></progress>
          <progress max="100"></progress> */}
        </div>
        <div className="Table">
          <h2>DynamoDB</h2>
          <button className="App-button">Backfill S3 to Dynamo</button>
          <DynamoTable />
        </div>
      </div>
    </div>
  );
}

export default App;
