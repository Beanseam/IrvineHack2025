import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

function SideBar()
{
   return (
    <section>
      
      <p class = "sidebar sidebarPos" style={{border: '1px solid black'}}></p>
      

    </section>
   );
}


function App() {
  console.log('Hello');
  const apiKey = import.meta.env.VITE_MAP_KEY;
  console.log(apiKey);

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = apiKey
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <div id='map-container' ref={mapContainerRef} style={{border: '1px solid black'}}/>
      <SideBar />
    </>
  )
}

export default App