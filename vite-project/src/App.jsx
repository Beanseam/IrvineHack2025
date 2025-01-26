import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { FaAnglesDown, FaAnglesUp, FaMinus, FaAngleUp, FaAngleDown } from "react-icons/fa6";

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

import Popup from './Popup';

const INITIAL_ZOOM = 17;

function SwitchingIcons({ state }) {
  return (
    <div>
      {state === 'FaMinus' && <FaMinus color='darkBlue' size={32} />}
      {state === 'FaAnglesDown' && <FaAnglesDown color='darkBlue' size={32} />}
      {state === 'FaAnglesUp' && <FaAnglesUp color='darkBlue' size={32} />}
      {state === 'FaAngleUp' && <FaAngleUp color='darkBlue' size={32} />}
      {state === 'FaAngleDown' && <FaAngleDown color='darkBlue' size={32} />}
    </div>
  );
}

function SideBar({ propData, compareGuess, iconState, numGuesses }) {
  const handleClick = () => {
    compareGuess(propData);
  };

  console.log(propData);

  return (
    <section>
      <p className="sidebar sidebar-pos" style={{ border: '1px solid black' }}></p>
      <div className="sidebar sidebar-pos" style={{ border: '1px solid black' }}>
        <div className="main-body">
          <div className="side-column">
            <div className="row-left-top">City:</div>
            <div className="row-left">Lot Size:</div>
            <div className="row-left">Bedrooms:</div>
            <div className="row-left">Bathrooms:</div>
            <div className="row-left">Year Built:</div>
            <div className="row-left">Floors:</div>
            <div className="row-left">Guesses:</div>
          </div>
          <div className="side-column">
            <div className="row-right-top" style={{ filter: "blur(8px)" }} id="city">{propData?.City || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="lot-size">{propData?.LotSizeOrArea || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="bedrooms">{propData?.NumberOfBedrooms || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="bathrooms">{propData?.NumberOfBaths || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="year-built">{propData?.YearBuilt || "N/A"}</div>
            <div className="row-right" style={{ filter: "blur(8px)" }} id="stories">{propData?.NumberOfStories || "N/A"}</div>
            <div className="row-right" id="guesses">{Math.abs(numGuesses - 8)}</div>
          </div>
        </div>
        <div className="large-margin">
          <div className="centered-row">
            <input type="text" id="user-guess" placeholder="Enter Your Guess!" />
            <div className="added-padding">
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
  const [numGuesses, setNumGuesses] = useState(1);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8000/generate");
      const data = await res.json();
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
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
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

    setNumGuesses(prev => prev + 1);


    if (userGuess < realValue - 10000 && userGuess > realValue - 30000) {
      setIconState("FaAngleUp");
    } else if(userGuess > realValue + 10000 && userGuess < realValue + 30000) {
      setIconState("FaAngleDown")
    }
    else if (userGuess < realValue - 10000) {
      setIconState("FaAnglesUp"); // Set state to Down Icon
    } else if (userGuess > realValue + 10000) {
      setIconState("FaAnglesDown"); // Set state to Up Icon
    }
    else {
      setIconState("FaMinus"); // Set state to Accessible Icon
      yesWin()
    }

    switch (numGuesses) {
      case 1:
        {
          map.setConfigProperty('basemap', 'showPedestrianRoads', true);
          map.setConfigProperty('basemap', 'showTransitLabels', true);
          
          updateBounds(map, initialCenter, .1);
          removeBlur("city");          
          break;
        }
      case 2:
        {
          map.setConfigProperty('basemap', 'showPlaceLabels', true);
          
          removeBlur("lot-size");
          updateBounds(map, initialCenter, .3);
          break;

        }
      case 3:
        {
          map.setConfigProperty('basemap', 'showRoadLabels', true);
          removeBlur("bathrooms");
          removeBlur("bedrooms");
          updateBounds(map, initialCenter, .5);
          break;
        }
      case 4:
        {
          map.setConfigProperty('basemap', 'showPointOfInterestLabels', true);
          removeBlur("year-built");
          updateBounds(map, initialCenter, 1);
          break;
        }

      case 5:
        {
          map.addLayer({
            id: 'satellite',
            source: {"type": "raster",  "url": "mapbox://mapbox.satellite", "tileSize": 256},
            type: "raster"
          });
          removeBlur("stories");
          
          alert("guess5");
          break;
        }
      case 6:
        {
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
          noWin()
          
          restartGame()
        }
    }

  };

  const restartGame = () => {
    if (mapRef.current) {
      mapRef.current.remove();
    }
    setIsDataLoaded(false);
    setNumGuesses(1);
    setIconState("FaMinus");
    document.getElementById("user-guess").value = "";
    fetchData();

    // Add the blur back to all of the elements:
    reAddBlur("city")
    reAddBlur("lot-size")
    reAddBlur("bathrooms")
    reAddBlur("bedrooms")
    reAddBlur("year-built")
    reAddBlur("stories")
    document.getElementById("input-button").textContent="Guess";
  };

  return (
    <>
      <div id='map-container' ref={mapContainerRef} style={{ border: '1px solid black' }} />
      {propertyData && (
        <SideBar propData={propertyData} compareGuess={compareGuess} iconState={iconState} numGuesses={numGuesses} />
      )}
      {isPopupVisible && (
        <Popup
          message={
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <p>Welcome to Property Guessing Game!</p>

              <p>As you guess, more information about the random home will be revealed.</p>
              <p>How well do you know the SoCal real estate market?</p>

              <p>*Please base your guesses on Property Assessment Values!</p>
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
              <p>{"The Total Assessed Property Value was: $" + propertyData.TotalAssessedValue}</p>
            </pre>
          }
          onClose={noWin}
        />
      )}
    </>
  );
}

function updateBounds(map, initialCenter, offset) {
  const bounds = [[initialCenter[0] - offset, initialCenter[1] - offset], [initialCenter[0] + offset, initialCenter[1] + offset]];
  map.setMaxBounds(bounds);
}

function removeBlur(elementId) {
  var element = document.getElementById(elementId);
  element.style.filter = "blur(0px)"
}
function reAddBlur(elementId) {
  var element = document.getElementById(elementId);
  element.style.filter = "blur(8px)"
}

export default App;