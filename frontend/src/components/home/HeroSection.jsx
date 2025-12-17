import React, { useState, useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBed, faSearch, faCalendarAlt, faUserFriends, faMinus, faPlus, faChevronRight, faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/home/HeroSection.scss";

const HeroSection = ({ isCardVisible, onCardEnter, onCardLeave }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(null);
  const [rooms, setRooms] = useState(1);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const backgroundImages = [
    "/images/hero-bg-1.jpg",
    "/images/hero-bg-2.jpg",
    "/images/hero-bg-3.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handlePrevBackground = () => {
    setBackgroundIndex((prevIndex) => (prevIndex - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const handleNextBackground = () => {
    setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  const handleSearch = () => {
    const params = {};
    if (destination) params.destination = destination;
    if (checkInDate && checkOutDate) {
      params.checkIn = checkInDate.toISOString().split("T")[0];
      params.checkOut = checkOutDate.toISOString().split("T")[0];
    }
    if (guests !== null) {
      params.guests = guests;
    }

    if (Object.keys(params).length === 0) {
      navigate("/search");
    } else {
      navigate({
        pathname: "/search",
        search: createSearchParams(params).toString(),
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); 
    }
  };

  const handleCounter = (type, operation) => {
    if (type === "rooms") {
      if (operation === "inc") setRooms(prev => prev + 1);
      if (operation === "dec" && rooms > 1) setRooms(prev => prev - 1);
    } else {
      if (operation === "inc") setGuests(prev => (prev || 0) + 1);
      if (operation === "dec" && (guests || 1) > 1) setGuests(prev => Math.max((prev || 1) - 1, 1));
    }
  };

  return (
    <div className="hero-section">
      <div 
        className="hero-bg" 
        style={{ backgroundImage: `url(${backgroundImages[backgroundIndex]})` }}
      ></div>

      <button className="hero-nav-btn hero-nav-prev" onClick={handlePrevBackground}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button className="hero-nav-btn hero-nav-next" onClick={handleNextBackground}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      
      <div className="hero-indicators">
        {backgroundImages.map((_, index) => (
          <button 
            key={index}
            className={`indicator-dot ${index === backgroundIndex ? 'active' : ''}`}
            onClick={() => setBackgroundIndex(index)}
            aria-label={`Go to background ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="hero-content">
        <div className="text-section">
          <h1>Hello!</h1>
          <p>검색을 통해 요금을 비교하고 무료 취소를 포함한 최저가 특가도 확인하세요!</p>
        </div>

        <div className="search-section">
          <h3>Where are you staying?</h3>
          <div className="search-form-simple">
            <div className="form-group destination">
              <div className="input-field">
                <FontAwesomeIcon icon={faBed} />
                <input 
                  type="text" 
                  placeholder="Search places, hotels..." 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <button className="btn-search-main" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;