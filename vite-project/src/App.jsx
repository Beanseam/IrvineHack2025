import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

const INITIAL_CENTER = [-117.8389, 33.6405]

const INITIAL_ZOOM = 17

function App() {
  console.log('Hello');
  const apiKey = import.meta.env.VITE_MAP_KEY;
  console.log(apiKey);

  const mapRef = useRef()
  const mapContainerRef = useRef()

  //const [center, setCenter] = useState(INITIAL_CENTER)
  //const [zoom, setZoom] = useState(INITIAL_ZOOM)

  useEffect(() => {
    mapboxgl.accessToken = apiKey
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <div id='map-container' ref={mapContainerRef}/>
    </>
  )
}

export default App