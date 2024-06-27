import React, { useState } from "react";
import "../style/Dashboard.css";

const Dashboard = ({ onLogout }) => {
  const [position, setPosition] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/submit_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city }),
      });
      const data = await response.json();
      setWeatherData(data.weather_data);
      setForecastData(data.forecast_data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSearch = () => {
    if (position) {
      fetchWeatherData(position);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setPosition(
            position.coords.latitude + ", " + position.coords.longitude
          );
          fetchWeatherData(
            position.coords.latitude + ", " + position.coords.longitude
          );
        },
        (error) => {
          setError(`Error: ${error.message}`);
        }
      );
    }
  };

  const handleSubcribe = () => {
  };

  const handleUnsubcribe = () => {
  };

  return (
    <div>
      <header className="header">Weather Dashboard</header>
      <div className="content">
        <div className="left-side">
          <div className="input-container">
            <p>Enter a City Name</p>
            <input
              type="text"
              placeholder="Enter something..."
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="subcribe-container">
            <button onClick={handleSubcribe}>Subcribe</button>
            <button onClick={handleUnsubcribe}>Unsubcribe</button>
          </div>

          <div className="divider">
            <span className="divider-text">or</span>
          </div>
          <button className="another-button" onClick={handleUseCurrentLocation}>
            Use current location
          </button>
          {location && (
            <div>
              <h3>Your Current Location:</h3>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </div>
          )}
          {error && <p>{error}</p>}
        </div>

        <div className="right-side">
          <div class="info-container">
            {weatherData ? (
              <>
                <div className="info-box">
                  <h3>{weatherData.location.country}</h3>
                  <p>Temperature: {weatherData.current.temp_c} &#8451;</p>
                  <p>Wind speed: {weatherData.current.wind_kph} KM/H</p>
                  <p>Humidity: {weatherData.current.humidity} %</p>
                </div>
                <div class="additional-info">
                  <p>{weatherData.current.condition.text}</p>
                </div>
              </>
            ) : (
              <p>No data</p>
            )}
          </div>

          <div className="days-label">4 Day Forecast</div>
          <div className="four-columns">
            {forecastData &&
              forecastData.forecast.forecastday.slice(1).map((day) => (
                <div className="column-box" key={day.date}>
                  <h4>({day.date})</h4>
                  <p>{day.day.condition.text}</p>
                  <p>Temp: {day.day.avgtemp_c} &#8451;</p>
                  <p>Max Wind: {day.day.maxwind_kph} KM/H</p>
                  <p>Humidity: {day.day.avghumidity} %</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button onClick={onLogout}>Logout</button>

    </div>
  );
};

export default Dashboard;
