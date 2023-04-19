import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AccountForm } from './components/AccountForm/AccountForm';

import { GlobeComponent } from './components/Globe/Globe';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route index element={<AccountForm />} />
            <Route path="/game" element={<GlobeComponent />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
