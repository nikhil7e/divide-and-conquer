import './App.css';

import { GlobeComponent } from './components/Globe/Globe';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GlobeComponent />
        {/* <Suspense fallback={<div>Loading...</div>}>
          <GoogleEarthGlobe center={[37.7749, -122.4194]} zoom={1} />
        </Suspense> */}
      </header>
    </div>
  );
}

export default App;
