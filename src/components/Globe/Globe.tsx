// import Globe from 'react-globe.gl';

// export function GlobeComponent() {
//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <Globe
//         globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
//         backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
//         width={window.innerWidth}
//         height={window.innerHeight}
//       />
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

export const GlobeComponent = () => {
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    // load data
    async function getData() {
      const res = await fetch('/ne_10m_admin_0_countries.json');
      const x = await res.json();
      setCountries(x);
      console.log(x);
    }

    getData();
  }, []);

  const handleCountryClick = (country) => {
    console.log(country);
    // Do something with the selected country data
  };

  return (
    <>
      {!countries && <h1>Loading...</h1>}
      {countries && (
        <Globe
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
          // @ts-ignore
          hexPolygonLabel={({ properties: d }) => `
                <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
                Population: <i>${d.POP_EST}</i>
              `}
          onHexPolygonClick={handleCountryClick}
        />
      )}
    </>
  );
};
