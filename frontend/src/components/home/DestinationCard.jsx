import React from "react";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const { name, country, image, price, description } = destination;

  const handleBookHotel = () => {
    // 해당 도시로 검색하는 페이지로 이동
    const searchParams = new URLSearchParams({
      destination: name,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      rooms: '1',
      guests: '2',
    });
    navigate(`/search?${searchParams.toString()}`);
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  };

  return (
    <div className="destination-card">
      {/* 1. 배경 이미지 */}
      <img src={image} alt={name} className="bg-image" />
      
      {/* 2. 어두운 그라데이션 (글씨 잘 보이게) */}
      <div className="overlay-gradient"></div>

      {/* 3. 텍스트 및 버튼 내용 */}
      <div className="card-content">
        <div className="text-info">
          <div className="top-row">
            <h3 className="city-name">{name}</h3>
            <span className="price">₩{price.toLocaleString()}</span>
          </div>
          <p className="description">{description}</p>
        </div>
        
        <button className="btn-book" onClick={handleBookHotel}>Book a Hotel</button>
      </div>
    </div>
  );
};

export default DestinationCard;