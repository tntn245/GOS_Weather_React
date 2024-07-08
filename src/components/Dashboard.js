import React, { useState } from "react";
import "../style/Dashboard.css";
import ProgressBar from "./ProgressBar";
import Header from "./Header";
import Modal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";

const Dashboard = ({ userID, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (position) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://weatherweb-1s99.onrender.com/submit_form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ position }),
        }
      );
      const data = await response.json();
      setWeatherData(data.weather_data);
      setForecastData(data.forecast_data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
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
        },
        (error) => {
          setError(`Error: ${error.message}`);
        }
      );
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://weatherweb-1s99.onrender.com/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ position, userID }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Subscription successful");
    } catch (error) {
      console.error("Error subscribing:", error.message);
    } finally {
      setLoading(false);
      alert("You will receive weather email")
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://weatherweb-1s99.onrender.com/sendemail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ position, userID }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Subscription successful");
    } catch (error) {
      console.error("Error subscribing:", error.message);
    }
  };

  return (
    <div>
      <Header userID={userID} onLogout={onLogout} />

      <div className="content">
        <div className="left-side">
          <div className="input-container">
            <p>Enter a City Name</p>
            <input
              type="text"
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
            <button onClick={handleSearch} disabled={!position.trim()}>
              Search
            </button>
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
                <div className="additional-info">
                  <div>
                    <div className="info-row">
                      <img
                        src={weatherData.current.condition.icon}
                        alt="Weather Icon"
                      />
                    </div>
                    <div className="info-row">
                      <p>{weatherData.current.condition.text}</p>
                    </div>
                  </div>
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
                  <img src={day.day.condition.icon} alt="Weather Icon" />
                  <p>Temp: {day.day.avgtemp_c} &#8451;</p>
                  <p>Max Wind: {day.day.maxwind_kph} KM/H</p>
                  <p>Humidity: {day.day.avghumidity} %</p>
                </div>
              ))}
          </div>

          <div className="subscribe-container">
            <button
              className="subscribe"
              onClick={handleSubscribe}
              disabled={!forecastData}
            >
              Receive email
            </button>
          </div>
        </div>
      </div>

      {/* Must write inner! */}
      <Modal
        isOpen={loading}
        onRequestClose={() => setLoading(false)}
        contentLabel="Loading Modal"
        className="loading-modal"
        style={{
          position: "relative",
        }}
      >
        <div className="loader-container"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ClipLoader
            color={"#5372F0"}
            loading={loading}
            cssOverride={{
              display: "block",
              margin: "0 auto",
            }}
            size={100}
            aria-label="Loading Spinner"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
