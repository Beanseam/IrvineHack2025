import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { FaAnglesDown } from "react-icons/fa6";

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'


const INITIAL_ZOOM = 17

function SideBar()
{
   return (
    <section>
      <p class = "sidebar sidebarPos" style={{border: '1px solid black'}}>
        <div class="main-body">
          <div class="side-column">
            <div class="row-left">City:</div>
            <div class="row-left">Lot Size:</div>
            <div class="row-left">Bedrooms:</div>
            <div class="row-left">Bathrooms:</div>
            <div class="row-left">Year Built:</div>
            <div class="row-left">Type:</div>
          </div>
          <div class="side-column">
            <div class="row-right">Santa Ana</div>
            <div class="row-right">Some Number</div>
            <div class="row-right">3</div>
            <div class="row-right">3</div>
            <div class="row-right">1990</div>
            <div class="row-right">Single-Family</div>
          </div>
        </div>
        <div class="large-margin">
          <div class="centered-row">
            <input type="text" id="user-guess" placeholder="Enter Your Guess!"></input>
            <FaAnglesDown style={{fontSize: '24px'}}/>
          </div>
          <div class="centered-row">
            <input type="submit" value="Guess"></input>
          </div>
        </div>
      </p>
      

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
      var map = mapRef.current

      // Add a marker at the specified latitude and longitude
      new mapboxgl.Marker()
        .setLngLat(initialCenter)
        .addTo(map); //mapRef.current is the current mapboxgl Map

        map.on('style.load', () => {
          map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
          map.setConfigProperty('basemap', 'showPedestrianRoads', false);
          map.setConfigProperty('basemap', 'showPlaceLabels', false);
          map.setConfigProperty('basemap', 'showRoadLabels', false);
          map.setConfigProperty('basemap', 'showTransitLabels', false);
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

function compareGuess(){
  var userGuess = document.getElementById("user-guess").innerHTML;
  var realValue = 100000;
  if(userGuess < (realValue - 5000)){

  }
  else if(userGuess > (realValue + 5000)){

  }
  else{

  }
}

export default App