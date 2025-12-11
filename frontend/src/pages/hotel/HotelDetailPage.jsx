/* src/pages/hotel/HotelDetailPage.jsx */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faStar,
  faWifi,
  faSwimmingPool,
  faUtensils,
  faSpa,
  faParking,
  faTv,
  faShareAlt,
  faHeart,
  faStar as faStarSolid,
  faCheck,
  faTimes,
  faSnowflake,
  faConciergeBell,
  faDumbbell,
  faCocktail,
  faBed,
  faMugHot,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { hotelApi } from "../../api/hotelApi";
import { reviewApi } from "../../api/reviewApi";
import { useWishlist } from "../../context/WishlistContext";

import "../../styles/pages/hotel/HotelDetailPage.scss";

/* 지도 아이콘 설정 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* 예약 폼 컴포넌트 */
const BookingForm = ({ hotel, navigate }) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [guests, setGuests] = useState(2);

  const handleBookingStart = () => {
    const checkInStr = checkInDate.toISOString().split('T')[0];
    const checkOutStr = checkOutDate.toISOString().split('T')[0];
    navigate(`/booking/${hotel.id}?checkIn=${checkInStr}&checkOut=${checkOutStr}&guests=${guests}`);
  };

  return (
    <>
      <div className="date-picker-group">
        <div className="date-field">
          <label>Check In</label>
          <DatePicker
            selected={checkInDate}
            onChange={setCheckInDate}
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div className="date-field">
          <label>Check Out</label>
          <DatePicker
            selected={checkOutDate}
            onChange={setCheckOutDate}
            dateFormat="yyyy/MM/dd"
            minDate={checkInDate}
          />
        </div>
      </div>
      <div className="guest-field">
        <label>Guests</label>
        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
          <option value="1">1 Person</option>
          <option value="2">2 Persons</option>
          <option value="3">3 Persons</option>
          <option value="4">4 Persons</option>
        </select>
      </div>
      <div className="price-summary">
        <div className="row">
          <span>${hotel.price} x 5 nights</span>
          <span>${hotel.price * 5}</span>
        </div>
        <div className="row">
          <span>Service fee</span>
          <span>$150</span>
        </div>
        <div className="row total">
          <span>Total</span>
          <span>${hotel.price * 5 + 150}</span>
        </div>
      </div>
      <button
        className="btn-confirm-book"
        onClick={handleBookingStart}
      >
        예약하기
      </button>
    </>
  );
};

const HotelDetailPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  useEffect(() => {
    const loadHotelData = async () => {
      setLoading(true);
      try {
        console.log('📡 호텔 상세 정보 로드 시작:', { hotelId });
        const params = {};
        if (checkIn) params.checkIn = checkIn;
        if (checkOut) params.checkOut = checkOut;

        const data = await hotelApi.getHotelDetail(hotelId, params);
        console.log('✅ 호텔 상세 정보 로드 성공:', data);
        setHotel(data?.hotel);
        setRooms(data?.rooms || []);
        setReviews(data?.reviews || []);
      } catch (error) {
        console.error('❌ 호텔 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      loadHotelData();
    }
  }, [hotelId, checkIn, checkOut]);

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(hotel);
    } catch (error) {
      console.error('찜하기 실패:', error);
      alert('찜하기에 실패했습니다.');
    }
  };

  const commonAmenities = [
    { icon: faSwimmingPool, name: "Outdoor pool" },
    { icon: faSwimmingPool, name: "Indoor pool" },
    { icon: faSpa, name: "Spa and wellness center" },
    { icon: faUtensils, name: "Restaurant" },
    { icon: faConciergeBell, name: "Room service" },
    { icon: faDumbbell, name: "Fitness center" },
    { icon: faCocktail, name: "Bar/Lounge" },
    { icon: faWifi, name: "Free Wi-Fi" },
    { icon: faMugHot, name: "Tea/coffee machine" },
  ];

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>;
  if (!hotel) return <div style={{ padding: '2rem', textAlign: 'center' }}>호텔 정보를 찾을 수 없습니다.</div>;
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStarSolid}
        className={i < Math.floor(rating) ? "star filled" : "star"}
      />
    ));

  return (
    <div className="hotel-detail-page">
      <div className="container">
        <div className="detail-header">
          <div className="header-left">
            <div className="title-row">
              <h1>{hotel.name}</h1>
              <div className="stars">{renderStars(hotel.rating)}</div>
            </div>
            <p className="address">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {hotel.address}
            </p>
          </div>
          <div className="header-right">
            <div className="price-box">
              <span className="price">₩{(hotel.price || 0).toLocaleString()}</span>
              <span className="unit">/박</span>
            </div>
            <div className="action-buttons">
              {/* ✅ [수정] 하트 버튼에 클릭 이벤트 & active 클래스 적용 */}
              <button
                className={`btn-icon ${isInWishlist(hotel._id || hotel.id) ? "active" : ""}`}
                onClick={handleToggleWishlist}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>

              <button className="btn-icon">
                <FontAwesomeIcon icon={faShareAlt} />
              </button>
              <button
                className="btn-book"
                onClick={() => navigate(`/booking/${hotelId}?checkIn=${checkIn || new Date().toISOString().split('T')[0]}&checkOut=${checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0]}&guests=2`)}
              >
                Book now
              </button>
            </div>
          </div>
        </div>

        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={hotel?.images?.[0] || hotel?.image || '/images/hotel-placeholder.jpg'} 
              alt="Main" 
            />
          </div>
          <div className="sub-images">
            {(hotel?.images || []).slice(1, 5).map((img, index) => (
              <div key={index} className="sub-image-item">
                <img src={img} alt="Sub" />
                {index === 3 && (hotel?.images?.length || 0) > 5 && (
                  <div className="more-overlay">+{(hotel?.images?.length || 0) - 5} Photos</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="content-wrapper">
          <div className="full-content">
            <section className="section overview">
              <h3>Overview</h3>
              <p className="description">{hotel.description}</p>
              <div className="overview-highlights">
                <div className="highlight-box rating-box">
                  <span className="score">{hotel.rating}</span>
                  <span className="text">Very good</span>
                  <span className="count">{hotel.reviews} reviews</span>
                </div>
                <div className="highlight-box">
                  <FontAwesomeIcon icon={faStar} />
                  <span>Near park</span>
                </div>
                <div className="highlight-box">
                  <FontAwesomeIcon icon={faUtensils} />
                  <span>Near nightlife</span>
                </div>
                <div className="highlight-box">
                  <FontAwesomeIcon icon={faSpa} />
                  <span>Near theater</span>
                </div>
                <div className="highlight-box">
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Clean Hotel</span>
                </div>
              </div>
            </section>
            <section className="section available-rooms">
              <h3>Available Rooms</h3>
              {rooms.length === 0 ? (
                <p>예약 가능한 객실이 없습니다.</p>
              ) : (
                <div className="room-list">
                  {rooms.map((room) => (
                    <div key={room._id || room.id} className="room-item">
                      <div className="room-img-box">
                        <img src={room.images?.[0] || room.image || "/images/room-placeholder.jpg"} alt="Room" />
                      </div>
                      <div className="room-info">
                        <span className="room-name">{room.name || room.type}</span>
                        <div className="room-price-action">
                          <span className="room-price">
                            ₩{(room.price || 0).toLocaleString()}/night
                          </span>
                          <button
                            className="btn-book-room"
                            onClick={() => navigate(`/booking/${hotelId}?checkIn=${checkIn || new Date().toISOString().split('T')[0]}&checkOut=${checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0]}&guests=2`)}
                          >
                            Book now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section className="section map-location">
              <div className="map-header">
                <h3>지도보기</h3>
                <button
                  className="btn-view-map"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        hotel.name
                      )}`,
                      "_blank"
                    )
                  }
                >
                  View on google maps
                </button>
              </div>
              {hotel?.coords?.lat && hotel?.coords?.lng ? (
                <div
                  className="map-image-box"
                  style={{ height: "40rem", zIndex: 0 }}
                >
                  <MapContainer
                    center={[hotel.coords.lat, hotel.coords.lng]}
                    zoom={15}
                    scrollWheelZoom={true}
                    dragging={true}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      attribution="© OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[hotel.coords.lat, hotel.coords.lng]}>
                      <Popup>{hotel.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div className="map-image-box" style={{ height: "40rem", padding: '2rem', textAlign: 'center' }}>
                  지도 정보를 불러올 수 없습니다.
                </div>
              )}
            </section>
            {(hotel?.amenities || []).length > 0 && (
              <section className="section amenities">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {hotel.amenities.map((item, index) => (
                    <div key={index} className="amenity-item">
                      <FontAwesomeIcon icon={typeof item === 'string' ? faWifi : item.icon} />
                      <span>{typeof item === 'string' ? item : item.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="section reviews">
              <div className="reviews-header">
                <h3>Reviews</h3>
                <button className="btn-write-review">Write a review</button>
              </div>
              <div className="review-summary-large">
                <span className="score">{hotel.rating || 0}</span>
                <div className="summary-text">
                  <span className="text">Very Good</span>
                  <span className="count">
                    {reviews.length} verified reviews
                  </span>
                </div>
              </div>
              {reviews.length === 0 ? (
                <p>아직 리뷰가 없습니다.</p>
              ) : (
                <div className="review-list">
                  {reviews.map((review) => (
                    <div key={review._id || review.id} className="review-card">
                      <div className="card-header">
                        <img
                          src={review.user?.profileImage || `https://i.pravatar.cc/150?u=${review.user?.email}`}
                          alt={review.user?.name || 'User'}
                          className="avatar"
                        />
                        <div className="user-info">
                          <div className="rating-row">
                            <span className="score">{review.rating}.0</span>
                            <span className="stars">
                              {renderStars(review.rating)}
                            </span>
                          </div>
                          <span className="username">{review.user?.name || 'Anonymous'}</span>
                        </div>
                        <span className="date">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="card-body">
                        <p className="content">{review.comment}</p>
                        {review.images?.length > 0 && (
                          <div className="review-images">
                            {review.images.map((img, idx) => (
                              <img key={idx} src={img} alt="Review" style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '0.5rem' }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button
              className="btn-close"
              onClick={() => setShowBookingModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>Book your stay</h3>
            <div className="price-header">
              <span className="price">${hotel.price}</span>
              <span className="unit">/night</span>
            </div>
            <BookingForm hotel={hotel} navigate={navigate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailPage;
