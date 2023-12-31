import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import './App.css';
import AuroraTable from './components/AuroraTable';
import DynamoTable from './components/DynamoTable';
import S3Table from './components/S3Table';
import S3Table1 from './components/S3Table1';
import { getChangeDBResult, getAuroraCount } from './fetcher.js';

function App() {
  const [auroraCount, setAuroraCount] = useState(0);
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const load = () => {
    getChangeDBResult().then((res) => {
      getCount();
      setMessage(res);
      setShowAlert(true);
      console.log(res);
    })
  }
  const getCount = () => {
    getAuroraCount().then((res) => {
      setAuroraCount(res[0]["count"]);
      console.log(res);
    })
  }
  getCount();

  const [currentTable, setCurrentTable] = useState('aurora');

  const toggle = () => {
    setCurrentTable(prevTable => prevTable === 'aurora' ? 'dynamo' : 'aurora');
  }

  const refresh = () => {
    window.location.reload();
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
      <div>
        AuroraDB Row Count: {auroraCount}
      </div>
      <div className="Table-container">
        <div className="Table">
          <h2>Toggle Table</h2>
          <button className="App-button" onClick={toggle}>Switch Table</button>
          {currentTable === 'aurora' ? <AuroraTable /> : <DynamoTable />}
        </div>
        <div className="Table">
          <h2>AuroraDB</h2>
          <button className="App-button" onClick={load}>Update Aurora Table</button>
          <AuroraTable />
        </div>
        <div className="Table">
          <h2>S3 List</h2>
          <button className="App-button" onClick={refresh}>Refresh List</button>
          <p>us-west-1</p>
          <S3Table />
          <p>us-east-2</p>
          <S3Table1 />
        </div>
        {/* <div className="Table">
          <h2>S3</h2>
          <BackfillToS3 />
          <CrossRegionDuplication />
        </div> */}
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
