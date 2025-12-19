/* src/pages/search/SearchPage.jsx */
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCalendarAlt,
  faUserFriends,
  faSearch,
  faPlus,
  faMinus,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/pages/search/SearchPage.scss";
import HotelCard from "../../components/hotel/HotelCard";
import FilterSidebar from "./FilterSidebar";
import { hotelApi } from "../../api/hotelApi";
import { defaultFilters, filterHotels } from "../../utils/filterHotels";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* 초기값 설정 */
  const initialDest = searchParams.get("city") || searchParams.get("destination") || "";
  const initialCheckIn = searchParams.get("checkIn")
    ? new Date(searchParams.get("checkIn"))
    : null;
  const initialCheckOut = searchParams.get("checkOut")
    ? new Date(searchParams.get("checkOut"))
    : null;
  const initialRooms = Number(searchParams.get("rooms")) || 1;
  const initialGuests = searchParams.get("guests")
    ? Number(searchParams.get("guests"))
    : null;

  const [destination, setDestination] = useState(initialDest);
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [rooms, setRooms] = useState(initialRooms); // rooms는 검색 파라미터에 사용하지 않음
  const [guests, setGuests] = useState(initialGuests);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recommend");
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));

  /* 호텔 데이터 로드 */
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      try {
        const params = {
          sort: sortBy,
          page: currentPage,
          limit: 500,
        };

        // 목적지가 있으면 추가
        if (destination) {
          params.city = destination;
        }

        // 체크인/체크아웃이 있으면 추가
        if (checkInDate && checkOutDate) {
          params.checkIn = checkInDate.toISOString().split("T")[0];
          params.checkOut = checkOutDate.toISOString().split("T")[0];
        }

        // 인원은 선택했을 때만 추가
        if (guests !== null) {
          params.guests = guests;
        }

        // 백엔드가 배열 또는 { items, total } 형태를 모두 반환할 수 있으므로 유연하게 처리
        const response = await hotelApi.getHotels(params);
        const items = Array.isArray(response)
          ? response
          : response?.items || [];
        const total =
          Array.isArray(response) && response.length
            ? response.length
            : response?.total ?? items.length ?? 0;

        setHotels(items);
        setTotalCount(total);
      } catch (error) {
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [destination, guests, checkInDate, checkOutDate, sortBy, currentPage]);

  /* 카운터 핸들러 */
  const handleCounter = (type, operation) => {
    if (type === "rooms") {
      // rooms는 현재 검색 파라미터에 포함하지 않음
      return;
    } else {
      if (operation === "inc") setGuests((prev) => (prev || 0) + 1);
      if (operation === "dec" && (guests || 1) > 1)
        setGuests((prev) => Math.max((prev || 1) - 1, 1));
    }
  };

  /* 검색 실행 */
  const handleSearch = () => {
    const params = { sort: sortBy };
    if (destination) params.city = destination;
    if (checkInDate && checkOutDate) {
      params.checkIn = checkInDate.toISOString().split("T")[0];
      params.checkOut = checkOutDate.toISOString().split("T")[0];
    }
    if (guests !== null) {
      params.guests = guests.toString();
    }
    setSearchParams(params);
    setCurrentPage(1);
  };

  const filteredHotels = useMemo(
    () => filterHotels(hotels, filters),
    [hotels, filters]
  );

  const handleFiltersChange = (updater) => {
    setFilters((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
    setCurrentPage(1);
  };

  const btnStyle = {
    width: "3.2rem",
    height: "3.2rem",
    borderRadius: "0.8rem",
    border: "none",
    backgroundColor: "#8DD3BB",
    color: "#112211",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div className="search-page">
      {/* 1. 상단 검색바 영역 */}
      <div className="search-bar-wrapper">
        <div className="search-container">
          {/* 목적지 */}
          <div className="input-group">
            <label>목적지</label>
            <div className="input-field">
              <FontAwesomeIcon icon={faBed} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="목적지 입력"
              />
            </div>
          </div>

          {/* 체크인 */}
          <div className="input-group">
            <label>체크인</label>
            <div className="input-field">
              <DatePicker
                selected={checkInDate}
                onChange={setCheckInDate}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
              />
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
          </div>

          {/* 체크아웃 */}
          <div className="input-group">
            <label>체크아웃</label>
            <div className="input-field">
              <DatePicker
                selected={checkOutDate}
                onChange={setCheckOutDate}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                minDate={checkInDate}
              />
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
          </div>

          {/* 인원 */}
          <div className="input-group" style={{ position: "relative" }}>
            <label>인원</label>
            <div
              className="input-field pointer"
              onClick={() => setShowGuestPopup(!showGuestPopup)}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faUserFriends} />
              <span
                className="guest-text"
                style={{
                  marginLeft: "1rem",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  flex: 1,
                }}
              >
                {guests !== null ? `인원 ${guests}명` : "인원 선택"}
              </span>
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{
                  marginLeft: "auto",
                  fontSize: "1.2rem",
                  transform: `rotate(${showGuestPopup ? "90deg" : "0deg"})`,
                  transition: "transform 0.2s",
                }}
              />
            </div>

            {/* 인원수 팝업 */}
            {showGuestPopup && (
              <div className="guest-popup">
                <div className="counter-row">
                  <span className="label">인원</span>
                  <div className="counter-controls">
                    <button
                      onClick={() => handleCounter("guests", "dec")}
                      disabled={guests <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="count">{guests}</span>
                    <button onClick={() => handleCounter("guests", "inc")}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 검색 버튼 */}
          <button className="btn-search" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {/* 2. 메인 컨텐츠 영역 (좌우 분할) */}
      <div className="container">
        {/* 그리드 레이아웃 */}
        <div className="search-layout-grid">
          {/* 왼쪽 사이드바 (필터) */}
          <aside className="search-sidebar">
            <FilterSidebar
              filters={filters}
              onChange={handleFiltersChange}
            />
          </aside>

          {/* 오른쪽 메인 콘텐츠 (호텔 리스트) */}
          <main className="search-content">
            {/* 정렬 버튼 등 */}
            <div
              className="list-header"
              style={{
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "2rem" }}>
                {loading ? "로딩 중..." : `검색 결과 ${filteredHotels.length}개`}
              </h2>
              <select
                style={{
                  padding: "0.8rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ccc",
                }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommend">추천순</option>
                <option value="popular">인기순</option>
                <option value="rating">평점순</option>
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>로딩 중...</div>
            ) : filteredHotels.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>조건에 맞는 호텔이 없습니다.</div>
            ) : (
              <div className="results-list">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))}
              </div>
            )}

            {/* ✅ [추가] Show more results 버튼 */}
            {filteredHotels.length > 0 && totalCount > hotels.length && (
              <button className="btn-show-more" onClick={() => setCurrentPage(prev => prev + 1)}>
                Show more results
              </button>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
