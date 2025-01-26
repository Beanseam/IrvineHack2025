import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'


const INITIAL_ZOOM = 17

function SideBar()
{
   return (
    <section>
      
      <p class = "sidebar sidebarPos" style={{border: '1px solid black'}}></p>
      

    </section>
   );
}


function App() {
  // Map related vars
  const apiKey = import.meta.env.VITE_MAP_KEY;

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [initialCenter, setInitialCenter] = useState([0, 0]); // Default coordinates

  var INITIAL_CENTER = [0, 0]

  
    
  useEffect(() => {
    let didCancel = false;

    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/generate");
        const data = await res.json();
        if (!didCancel) {
          console.log(data.MAK, data.Latitude, data.Longitude);
          setInitialCenter([data.Longitude, data.Latitude]);
          setIsDataLoaded(true); // Mark data as loaded
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      // Initialize the map only after data is loaded
      mapboxgl.accessToken = apiKey;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: initialCenter,
        zoom: INITIAL_ZOOM,
      });
    }
  }, [isDataLoaded, initialCenter]);

  return (
    <>
      <div id='map-container' ref={mapContainerRef} style={{border: '1px solid black'}}/>
      <SideBar />
    </>
  )
}

export default App