import { useState, useEffect } from 'react'
import './App.css'
// import Proptypes from 'prop-types'  // not mandatory

// images
import searchicon from './assets/search_icon.png'
import clearicon from './assets/summer.png'
import snowicon from './assets/snow.png'
import rainicon from './assets/rain.png'
import humidityicon from './assets/humidity.png'
import windicon from './assets/wind.png'
import drizzleicon from './assets/drizzle.png'

const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) => {
  return(
    <>
      <div className='image'>
        <img src = {icon} alt="Image" />
      </div>
      <div className="temp"> {temp}°C </div>
      <div className="location"> {city} </div>
      <div className="country"> {country} </div>
      <div className="cord">
        <div>
          <span className='lat'>Latitude</span>
          <span> {lat} </span>
        </div>
        <div>
          <span className='log'>Longitude</span>
          <span> {log} </span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityicon} alt="humidity" className='icon'/>
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={windicon} alt="wind" className='icon'/>
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

// WeatherDetails.proptypes = {
//   icon: Proptypes.string.isRequired,
//   temp: Proptypes.number.isRequired,
//   city: Proptypes.string.isRequired,
//   country: Proptypes.string.isRequired,
//   humidity: Proptypes.number.isRequired,
//   wind: Proptypes.number.isRequired,
//   lat: Proptypes.number.isRequired,
//   log: Proptypes.number.isRequired,
// };

function App() {

  let api_key = "d2bc7974f60ab51722408fd369b05736";
  const [text, setText] = useState("Chennai");

  const [icon, setIcon] = useState(snowicon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCounty] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLang] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherCondition = {
    "01d": clearicon,
    "01n": clearicon,
    "02d": clearicon,
    "02n": clearicon,
    "03n": drizzleicon,
    "03d": drizzleicon,
    "04n": drizzleicon,
    "04d": drizzleicon,
    "09d": rainicon,
    "09n": rainicon,
    "10d": rainicon,
    "10n": rainicon,
    "13d": snowicon,
    "13n": snowicon
  };

  const SearchApi = async () => {
    // setLoading(true);

    console.log("searchapi called");
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json(res);
      console.log(data);

      if(data.cod === "404")
      {
        console.log("city not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      else setCityNotFound(false);

      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCounty(data.sys.country);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setLang(data.coord.lon);
      setLat(data.coord.lat);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherCondition[weatherIconCode] || clearicon);
      setText("");
      setError("");
      
    }
    catch(error){
      console.error(error.message);
      setError("An error occured fetching weather details");
    }
    finally{
      setLoading(false);
      // setCityNotFound(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    console.log(e.key);
    if(e.key === "Enter") SearchApi();
  };

  useEffect(function(){
    SearchApi();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
            <input type="text" className='cityInput' placeholder='Select city' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
            <div className='search-icon'>
              <img src={searchicon} alt="Search" onClick={() => {
                SearchApi();
              }} />
            </div>
        </div>

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon = {icon} temp = {temp} city = {city} country = {country} lat = {lat} log = {log} humidity = {humidity} wind = {wind} />}

        <p className='copyright'> Designed by <span>GeeKay Tech</span> </p>

      </div>
      
    </>
  );
}

export default App;
