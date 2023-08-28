import './App.css';
import AuroraTable from './components/AuroraTable';
import S3Table from './components/S3Table';
import DynamoTable from './components/DynamoTable';
import S3CrossRegionTable from './components/S3CrossRegionTable';

function App() {
  return (
    <div className="App">
      <div>
        <button className="App-button">Update Aurora Table</button>
        <button className="App-button">Backfill Aurora to S3</button>
        <button className="App-button">S3 Cross Region Duplication</button>
        <button className="App-button">Backfill S3 to Dynamo</button>
      </div>
      <div className="Table-container">
        <div className="Table">
          <p>Aurora Table</p>
          <AuroraTable />
        </div>
        <div className="Table">
          <p>S3 Table</p>
          <S3Table />
        </div>
        <div className="Table">
          <p>S3 Cross Region Table</p>
          <S3CrossRegionTable />
        </div>
        <div className="Table">
          <p>Dynamo Table</p>
          <DynamoTable />
        </div>
      </div>
    </div>
  );
}

export default App;
