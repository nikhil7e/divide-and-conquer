import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';

const GoogleEarthMap = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={props.zoom}
      defaultCenter={props.center}
      options={{
        tilt: 0,
        heading: 0,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        backgroundColor: 'black',
        mapTypeId: 'earth',
      }}
    />
  ))
);

export default function GoogleEarthGlobe({ center, zoom }) {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleEarthMap
        googleMapURL={`https://earth.google.com/web/@${center[0]},${center[1]},0a,0d,0y,0h,0t,0r`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  );
}
