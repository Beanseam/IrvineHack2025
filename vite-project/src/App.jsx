import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'


const INITIAL_ZOOM = 17

function SideBar(propData)
{
  console.log(propData)
  console.log(propData.propData.City)
   return (
    <section>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </head>
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
            <div class="row-right">{propData.propData?.City || "N/A"}</div>
            <div class="row-right">{propData.propData?.LotSizeOrArea || "N/A"}</div>
            <div class="row-right">{propData.propData?.NumberOfBedrooms || "N/A"}</div>
            <div class="row-right">{propData.propData?.NumberOfBaths || "N/A"}</div>
            <div class="row-right">{propData.propData?.YearBuilt || "N/A"}</div>
            <div class="row-right">{propData.propData?.CountyLandUseDescription || "N/A"}</div>
          </div>
        </div>
        <div class="large-margin">
          <div class="centered-row">
            <input type="text" id="user-guess" placeholder="Enter Your Guess!"></input>
            <i class='fas fa-angle-double-down' ></i>
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
  const [propertyData, setPropertyData] = useState(null); // State for property data

  var INITIAL_CENTER = [0, 0]

  useEffect(() => {
    let didCancel = false;

    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/generate");
        const data = await res.json();
        if (!didCancel) {
          console.log(data);
          setInitialCenter([data.Longitude, data.Latitude]);
          // Assuming the API response includes property data
          setPropertyData({
            City: data.City,
            LotSizeOrArea: data.LotSizeOrArea,
            NumberOfBedrooms: data.NumberOfBedrooms,
            NumberOfBaths: data.NumberOfBaths,
            YearBuilt: data.YearBuilt,
            CountyLandUseDescription: data.CountyLandUseDescription,
          });
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
      <SideBar propData={propertyData} />
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