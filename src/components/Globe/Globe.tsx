import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import './Globe.css';

export const GlobeComponent = () => {
  const [countries, setCountries] = useState({ features: [] });
  const [gameState, setGameState] = useState(null);
  const globeRef = useRef<GlobeMethods>(null);
  const [hoverD, setHoverD] = useState(null);

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

  const showCountry = () => {
    // find the selected country in the game state
    const selectedCountry = gameState.playerCountry.name;
    // find the matching feature for the selected country in the countries data
    const selectedFeature = countries.features.find((feature) => feature.properties.ADMIN === selectedCountry);
    // fly to the selected country
    // globeRef.current.toGlobeCoords(
    //   selectedFeature.properties.coordinates[0],
    //   selectedFeature.properties.coordinates[1]
    // );
    console.log(selectedFeature.geometry.coordinates[0]);
    globeRef.current?.pointOfView(
      {
        lat: selectedFeature.geometry.coordinates[0][0][0][1],
        lng: selectedFeature.geometry.coordinates[0][0][0][0],
        altitude: 1,
      },
      500
    );
  };

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat) => feat.properties.GDP_MD_EST;

  const maxVal = useMemo(() => Math.max(...countries.features.map(getVal)), [countries]);
  colorScale.domain([0, maxVal]);

  const handleCountryClick = (country) => {
    console.log(country);
    // get country stats from gameState object
    const countryStats = gameState.countries.find((c) => c.name === country.properties.ADMIN);
    console.log(countryStats);
  };

  const hexPolygonLabel = ({ properties: d }) => {
    const countryStats = gameState.countries.find((c) => c.name === d.ADMIN);
    return `
      <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
      Population: <i>${d.POP_EST}</i> <br />
      Resources: <i>${countryStats.resources}</i>
    `;
  };

  const handleHexPolygonHover = (hexPolygon) => {
    setHoverD(hexPolygon);
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
            <div className="stats" onClick={showCountry}>
              <h2>{gameState.playerCountry.name}</h2>
              <ul>
                <li>Resources: {gameState.playerCountry.resources}</li>
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
            hexPolygonsData={countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')}
            lineHoverPrecision={0}
            hexPolygonResolution={4}
            hexSideColor={() => 'rgba(0, 100, 0, 0.15)'}
            hexPolygonMargin={0}
            hexPolygonAltitude={0.1}
            hexPolygonColor={(d) => (d === hoverD ? 'steelblue' : colorScale(getVal(d)))}
            hexPolygonLabel={hexPolygonLabel}
            onHexPolygonHover={handleHexPolygonHover}
            hexPolygonsTransitionDuration={300}
            hexPolygonCurvatureResolution={0}
            onHexPolygonClick={handleCountryClick}
          />
        </>
      )}
    </>
  );
};

export default GlobeComponent;
