import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { FaAnglesDown, FaAnglesUp, FaMinus } from "react-icons/fa6";

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

import Popup from './Popup';

const INITIAL_ZOOM = 17;
var guesses = 0;

function SwitchingIcons({ state }) {
  return (
    <div>
      {state === 'FaMinus' && <FaMinus color='darkBlue' size={32} />}
      {state === 'FaAnglesDown' && <FaAnglesDown color='darkBlue' size={32} />}
      {state === 'FaAnglesUp' && <FaAnglesUp color='darkBlue' size={32} />}
    </div>
  );
}

function SideBar({ propData, compareGuess, iconState }) {
  const handleClick = () => {
    compareGuess(propData);
  };

  console.log(propData);

  return (
    <section>
      <p class = "sidebar sidebar-pos" style={{border: '1px solid black'}}></p>
      <div className="sidebar sidebar-pos" style={{ border: '1px solid black' }}>
        <div className="main-body">
          <div className="side-column">
            <div className="row-left-top">City:</div>
            <div className="row-left">Lot Size:</div>
            <div className="row-left">Bedrooms:</div>
            <div className="row-left">Bathrooms:</div>
            <div className="row-left">Year Built:</div>
            <div className="row-left">Floors:</div>
          </div>
          <div className="side-column">
            <div className="row-right-top" style={{ filter: "blur(8px)" }} id="city">{propData?.City || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="lot-size">{propData?.LotSizeOrArea || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="bedrooms">{propData?.NumberOfBedrooms || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="bathrooms">{propData?.NumberOfBaths || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="year-built">{propData?.YearBuilt || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="stories">{propData?.NumberOfStories || "N/A"}</div>
          </div>
        </div>
        <div className="large-margin">
          <div className="centered-row">
            <input type="text" id="user-guess" placeholder="Enter Your Guess!" />
            <div class="added-padding">
              <SwitchingIcons state={iconState} /> {/* Pass the icon state */}
            </div>
          </div>
          <div className="centered-row">
            <button className="derpy-button" id="input-button" onClick={handleClick}>
              Guess
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  //popup
  const [isPopupVisible, setPopupVisible] = useState(true);
  const [isWin, setWin] = useState(false);

  const closePopup = () => {
    setPopupVisible(false);
  };
  const noWin = () => {
    setWin(false);
  }

  //call yesWin to display win popup
  const yesWin = () => {
    setWin(true);
  }

  // Map related vars
  const apiKey = import.meta.env.VITE_MAP_KEY;
  const [iconState, setIconState] = useState("FaMinus"); // Track icon state
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [initialCenter, setInitialCenter] = useState([0, 0]); // Default coordinates
  const [propertyData, setPropertyData] = useState(null); // State for property data

  var numGuesses = 0;

  useEffect(() => {
    let didCancel = false;

    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/generate");
        const data = await res.json();
        if (!didCancel) {
          console.log(data);
          setInitialCenter([data.Longitude, data.Latitude]);
          setPropertyData({
            City: data.City,
            LotSizeOrArea: data.LotSizeOrArea,
            NumberOfBedrooms: data.NumberOfBedrooms,
            NumberOfBaths: data.NumberOfBaths,
            YearBuilt: data.YearBuilt,
            NumberOfStories: data.NumberOfStories,
            TotalAssessedValue: data.TotalAssessedValue
          });
          setIsDataLoaded(true); // Mark data as loaded
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setInitialCenter([-117.894009, 33.761373]);
        setPropertyData({
          City: "Santa Ana",
          LotSizeOrArea: 6050,
          NumberOfBedrooms: 2,
          NumberOfBaths: 1,
          YearBuilt: 1951,
          NumberOfStories: 1,
          TotalAssessedValue: 280428
        });
        setIsDataLoaded(true); // Mark data as loaded
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
      const map = mapRef.current;

      // Add a marker at the specified latitude and longitude
      new mapboxgl.Marker()
        .setLngLat(initialCenter)
        .addTo(map);

      map.on('style.load', () => {
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
        map.setConfigProperty('basemap', 'showPedestrianRoads', false);
        map.setConfigProperty('basemap', 'showPlaceLabels', false);
        map.setConfigProperty('basemap', 'showRoadLabels', false);
        map.setConfigProperty('basemap', 'showTransitLabels', false);
        updateBounds(map, initialCenter, .01);
      });
    }
  }, [isDataLoaded, initialCenter]);

  const compareGuess = (propData) => {
    const map = mapRef.current;
    const userGuess = document.getElementById("user-guess").value; // Get user input
    const realValue = propData.TotalAssessedValue;

    if (userGuess < realValue - 10000) {
      setIconState("FaAnglesUp"); // Set state to Down Icon
      numGuesses++;
    } else if (userGuess > realValue + 10000) {
      setIconState("FaAnglesDown"); // Set state to Up Icon
      numGuesses++;
    } else {
      setIconState("FaMinus"); // Set state to Accessible Icon
      alert("You win!");
      numGuesses++;
    }

    switch (numGuesses) {
      case 1:
        {
          map.setConfigProperty('basemap', 'showPlaceLabels', true);
          updateBounds(map, initialCenter, .1);
          removeBlur("city");
          alert("guess 1");
          
          break;
        }
      case 2:
        {
          map.setConfigProperty('basemap', 'showRoadLabels', true);
          removeBlur("lot-size");
          updateBounds(map, initialCenter, .3);
          alert("guess 2");
          break;

        }
      case 3:
        {
          map.setConfigProperty('basemap', 'showPedestrianRoads', true);
          removeBlur("bathrooms");
          removeBlur("bedrooms");
          updateBounds(map, initialCenter, .5);
          alert("guess3");
          break;
        }
      case 4:
        {
          map.setConfigProperty('basemap', 'showTransitLabels', true);
          removeBlur("year-built");
          updateBounds(map, initialCenter, 1);
          alert("guess4");
          break;
        }

      case 5:
        {
          map.setConfigProperty('basemap', 'showPointOfInterestLabels', true);
          removeBlur("stories");
          
          alert("guess5");
          break;
        }
      case 6:
        {
          alert("guess6");
          // free guess 1
          break;
        }
      case 7:
        {
          alert("guess7");
          break;
          // free guess 2
        }
      default:
        {
          console.log("Reset Game")
          alert("game over");
        }
    }

  };

  return (
    <>
      <div id='map-container' ref={mapContainerRef} style={{ border: '1px solid black' }} />
      {propertyData && (
        <SideBar propData={propertyData} compareGuess={compareGuess} iconState={iconState} />
      )}
      {isPopupVisible && (
        <Popup
          message={
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <p>Welcome to Property Guessing Game!</p>

              <p>As you guess, more information about the random home will be revealed.</p>
              <p>How well do you know the SoCal real estate market?</p>
              <p>Happy Guessing!</p>
            </pre>
          }
          onClose={closePopup}
        />
      )}
      {isWin && (
        <Popup
          message={
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <p>Congratulations! </p>
              <p>You Win! Seems like you really know SoCal well!</p>
            </pre>
          }
          onClose={noWin}
        />
      )}
    </>
  );
}

function updateBounds(map, initialCenter, offset)//numGuesses)
{
  //const offset = numGuesses * .15;
  const bounds = [[initialCenter[0] - offset, initialCenter[1] - offset], [initialCenter[0] + offset, initialCenter[1] + offset]];
  map.setMaxBounds(bounds);
}



function removeBlur(elementId)
{
  var element = document.getElementById(elementId);
  element.removeAttribute("style");
}



export default App;
