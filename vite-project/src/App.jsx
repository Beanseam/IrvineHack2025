import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

const INITIAL_CENTER = [-117.8389, 33.6405]

const INITIAL_ZOOM = 17

function App() {
  // Map related vars
  const apiKey = import.meta.env.VITE_MAP_KEY;

  const mapRef = useRef()
  const mapContainerRef = useRef()
    
  useEffect(() => {
    mapboxgl.accessToken = apiKey
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
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