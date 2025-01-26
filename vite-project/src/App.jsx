import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

function App() {
  // Map related vars
  const apiKey = import.meta.env.VITE_MAP_KEY;

  const mapRef = useRef()
  const mapContainerRef = useRef()
    
  useEffect(() => {
    mapboxgl.accessToken = apiKey
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    });
    fetch('http://localhost:8000/generate')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPhotos(data);
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