import React from 'react';
import './App.css';
import InfoTable from './component/InfoTable';
import Provider from './context/StarWarsProvider';

function App() {
  return (
    <Provider>
      <div className="App">
        <InfoTable />
      </div>
    </Provider>
  );
}

export default App;
