import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../style/Dashboard.css";

const Dashboard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/submit_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city }),
      });
      const data = await response.json();
      setWeatherData(data.weather_data);
      setForecastData(data.forecast_data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSearch = () => {
    if (city) {
      fetchWeatherData(city);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(`${latitude},${longitude}`);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
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
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="divider">
            <span className="divider-text">or</span>
          </div>
          <button className="another-button" onClick={handleUseCurrentLocation}>
            Use current location
          </button>
        </div>

        <div className="right-side">
          <div className="info-box">
            {weatherData ? (
              <>
                <h3>{weatherData.location.country}</h3>
                <p>Temperature: {weatherData.current.temp_c} &#8451;</p>
                <p>Wind speed: {weatherData.current.wind_kph} KM/H</p>
                <p>Humidity: {weatherData.current.humidity} %</p>
                <p>{weatherData.current.condition.text}</p>
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
    </div>
  );
};

export default Dashboard;
