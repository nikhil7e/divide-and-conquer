import { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import './Globe.css';

export const GlobeComponent = () => {
  const [countries, setCountries] = useState(null);
  const [gameState, setGameState] = useState(null);
  const globeRef = useRef<GlobeMethods>(null);

  useEffect(() => {
    // load data
    async function getData() {
      const res = await fetch('/ne_10m_admin_0_countries.json');
      const x = await res.json();
      setCountries(x);
    }

    getData();

    // fetch initial game state
    async function getGameState() {
      const res = await fetch('http://localhost:4000/gamestate');
      const data = await res.json();
      setGameState(data);
    }

    getGameState();
  }, []);

  const handleCountryClick = (country) => {
    console.log(country);
    // get country stats from gameState object
    const countryStats = gameState[country.properties.ADMIN];
    console.log(countryStats);
    // display stats in tooltip or modal
  };

  const hexPolygonLabel = ({ properties: d }) => {
    console.log(gameState);
    console.log(d);
    const countryStats = gameState.countries.find((c) => c.name === d.ADMIN);
    console.log(countryStats);
    return `
      <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
      Population: <i>${d.POP_EST}</i> <br />
      Resources: <i>${countryStats.resources}</i>
    `;
  };

  return (
    <>
      {(!countries || !gameState) && <h1>Loading...</h1>}
      {countries && gameState && (
        <>
          <div className="overlay" style={{ pointerEvents: 'none' }}>
            <div className="header">
              <h1>World Domination</h1>
              <p>Turn {gameState.turn}</p>
            </div>
            <div className="stats">
              <h2>Your Country</h2>
              <ul>
                <li>Country: x</li>
                <li>Population: x</li>
                <li>Resources: x</li>
                {/* <li>Army: {playerCountry.armySize}</li> */}
              </ul>
            </div>
            <div className="actions">
              <h2>Actions</h2>
              <ul>
                <li>
                  <button>End Turn</button>
                </li>
                <li>
                  <button>Build Army</button>
                </li>
                <li>
                  <button>Attack</button>
                </li>
                <li>
                  <button>Diplomacy</button>
                </li>
              </ul>
            </div>
          </div>
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            hexPolygonsData={countries.features}
            hexPolygonResolution={3}
            hexPolygonMargin={0.3}
            hexPolygonColor={() =>
              `#${Math.round(Math.random() * Math.pow(2, 24))
                .toString(16)
                .padStart(6, '0')}`
            }
            hexPolygonAltitude={0.01}
            hexPolygonLabel={hexPolygonLabel}
            onHexPolygonClick={handleCountryClick}
          />
        </>
      )}
    </>
  );
};
