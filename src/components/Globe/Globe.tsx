import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Globe, { GlobeMethods } from 'react-globe.gl';
import './Globe.css';

export const GlobeComponent = () => {
  const [countries, setCountries] = useState({ features: [] });
  const [gameState, setGameState] = useState(null);
  const [hoverD, setHoverD] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [playerCountry, setPlayerCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

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

  useEffect(() => {
    if (gameState) {
      setPlayerCountry(gameState.playerCountry);
    }
  }, [gameState]);

  const showCountry = () => {
    if (!playerCountry || !countries) {
      return [];
    }

    console.log(countries);

    // find the selected country in the game state
    // find the matching feature for the selected country in the countries data
    const selectedFeature = countries.features.find((feature) => feature.properties.ADMIN === playerCountry.name);

    globeRef.current?.pointOfView(
      {
        lat: selectedFeature.geometry.coordinates[0][0][0][1],
        lng: selectedFeature.geometry.coordinates[0][0][0][0],
        altitude: 1.5,
      },
      4000
    );
  };

  const pointsData = useMemo(() => {
    if (!playerCountry) {
      return [];
    }

    const selectedFeature = countries.features.find((feature) => feature.properties.ADMIN === playerCountry.name);

    if (!selectedFeature) {
      return [];
    }

    const coords = selectedFeature.geometry.coordinates;

    const first = Math.floor(coords.length / 2);
    const second = Math.floor(coords[first].length / 2);
    const third = Math.floor(coords[first][second].length / 2);

    const points = [
      {
        lat: coords[first][second][third][1],
        lng: coords[first][second][third][0],
        name: 'Your country',
      },
    ];

    return points;
  }, [playerCountry, countries]);

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat) => feat.properties.GDP_MD_EST;

  const maxVal = useMemo(() => Math.max(...countries.features.map(getVal)), [countries]);
  colorScale.domain([0, maxVal]);

  const handleCountryClick = (country, e: MouseEvent) => {
    if (selectedAction === 'attack' || selectedAction === 'diplomacy') {
      setSelectedAction(null);
    }
    if (selectedCountry === country) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(country);
      setHoverD(null);
    }
  };

  const hexPolygonLabel = ({ properties: d }) => {
    const countryStats = gameState.countries.find((c) => c.name === d.ADMIN);

    const jsxString = ReactDOMServer.renderToString(
      <div className="overlay-label">
        <b>
          {d.ADMIN} ({d.ISO_A2})
        </b>{' '}
        <br />
        Population: <i>{d.POP_EST}</i> <br />
        Resources: <i>{countryStats.resources}</i> <br />
        Troops: <i>{countryStats.troops}</i>
      </div>
    );

    return jsxString;
  };

  const handleHexPolygonHover = (hexPolygon) => {
    setHoverD(hexPolygon);
  };

  const handleSelectAction = (action) => {
    if (selectedAction === action) {
      setSelectedAction(null);
    } else {
      setSelectedAction(action);
    }
  };

  const handleEndTurn = async () => {
    const requestBody = {
      action: selectedAction,
      countryName: gameState.playerCountry.name,
      selectedCountryName: selectedCountry?.properties.ADMIN,
      gameStateId: gameState.id,
    };

    const res = await fetch('http://localhost:4000/turn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const data = await res.json();

    setSelectedAction(null);
    setGameState(data);
  };

  return (
    <>
      {(!countries || !gameState) && <h1>Loading...</h1>}
      {countries && gameState && playerCountry && (
        <>
          <div className="overlay" style={{ pointerEvents: 'none' }}>
            <div className="header">
              <h1>Dictator Simulator</h1>
              <h1>Turn {gameState.turn}</h1>
            </div>
            <div className="stats" onClick={showCountry}>
              <h2>{gameState.playerCountry.name}</h2>
              <ul>
                <li>Resources: {gameState.playerCountry.resources}</li>
                <li>Troops: {gameState.playerCountry.troops}</li>
                <li>Population: x</li>
                {/* <li>Army: {playerCountry.armySize}</li> */}
              </ul>
            </div>
            <div className="actions home-actions">
              <h2>Actions</h2>
              <ul>
                <li>
                  <button
                    className={selectedAction === null ? 'not-selected end-turn' : 'selected end-turn'}
                    onClick={handleEndTurn}>
                    End Turn
                  </button>
                </li>
                <li>
                  <button
                    className={selectedAction === 'buildArmy' ? 'selected' : 'not-selected'}
                    onClick={() => handleSelectAction('buildArmy')}>
                    Build Army
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {playerCountry && (
            <>
              <Globe
                ref={globeRef}
                globeImageUrl="https://unpkg.com/three-globe@2.25.7/example/img/earth-dark.jpg"
                hexPolygonsData={countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')}
                lineHoverPrecision={0}
                hexPolygonResolution={4}
                hexSideColor={() => 'rgba(0, 100, 0, 0.15)'}
                hexPolygonMargin={0}
                //@ts-ignore
                hexPolygonAltitude={0.1}
                hexPolygonColor={(d) => (d === hoverD ? 'steelblue' : colorScale(getVal(d)))}
                hexPolygonLabel={hexPolygonLabel}
                onHexPolygonHover={handleHexPolygonHover}
                hexPolygonsTransitionDuration={300}
                hexPolygonCurvatureResolution={0}
                onHexPolygonClick={handleCountryClick}
                onGlobeReady={showCountry}
                pointsData={pointsData}
                pointColor={() => 'green'}
                pointAltitude={1}
                onGlobeClick={() => {
                  if (selectedAction === 'attack' || selectedAction === 'diplomacy') {
                    setSelectedAction(null);
                  }
                  setSelectedCountry(null);
                }}
              />
              {selectedCountry && (
                <div className="actions target-actions popup">
                  <h2>{selectedCountry.properties.ADMIN}</h2>
                  <h2>Interact</h2>
                  <ul>
                    <li>
                      <button
                        className={selectedAction === 'attack' ? 'selected' : 'not-selected'}
                        onClick={() => handleSelectAction('attack')}>
                        Attack
                      </button>
                    </li>
                    <li>
                      <button
                        className={selectedAction === 'diplomacy' ? 'selected' : 'not-selected'}
                        onClick={() => handleSelectAction('diplomacy')}>
                        Diplomacy
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default GlobeComponent;
