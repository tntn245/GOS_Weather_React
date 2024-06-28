import React, { useState, useEffect } from "react";
import "../style/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell, faClose } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

const Header = ({ userID, onLogout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modalIsOpen) {
      setIsLoading(true);
      fetchUserSubscriptions();
    }
  }, [modalIsOpen]);

  const fetchUserSubscriptions = () => {
    fetch("https://weatherweb-1s99.onrender.com/loadUserSub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: userID }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPositions(data.positions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user subscriptions:", error);
        setIsLoading(false);
      });
  };

  const handleUnsubscribe = (position) => {
    fetch("https://weatherweb-1s99.onrender.com/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userID: userID, position: position })
    })
      .then(response => response.json())
      .then(data => {
        fetchUserSubscriptions();
      })
      .catch(error => {
        console.error("Error unsubscribing:", error);
      });
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="left">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="icon"
              onClick={onLogout}
            />
          </div>

          <div className="center">
            <h3>Weather Dashboard</h3>
          </div>

          <div className="right">
            <FontAwesomeIcon
              icon={faBell}
              className="icon"
              onClick={openModal}
            />
          </div>
        </div>
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className="modal-header">
          <h2 className="modal-text">Modal Content</h2>
          <button className="close-button" onClick={closeModal}>
          <FontAwesomeIcon
                      icon={faClose}
                    />
          </button>
        </div>
        
        <div className="modal-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {positions.map((position, index) => (
                <div key={index} className="subscription-item">
                  <input type="text" disabled value={position} />
                  <button onClick={() => handleUnsubscribe(position)}>
                    Unsubscribe
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Header;
