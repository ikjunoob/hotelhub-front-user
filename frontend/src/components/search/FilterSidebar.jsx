import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { defaultFilters } from "../../utils/filterHotels";

// 섹션 접기/펼치기 컨테이너
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <div className="section-header" onClick={() => setIsOpen(!isOpen)}>
        <h4>{title}</h4>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
      {isOpen && <div className="section-content">{children}</div>}
    </div>
  );
};

const ratingOptions = [
  { value: 5, label: "5.0" },
  { value: 4, label: "4.0 이상" },
  { value: 3, label: "3.0 이상" },
  { value: 2, label: "2.0 이상" },
  { value: 1, label: "1.0 이상" },
];

const freebiesOptions = [
  { label: "무료 와이파이", value: "무료 와이파이" },
  { label: "무료 조식", value: "무료 조식" },
  { label: "무료 주차", value: "무료 주차" },
  { label: "공항 셔틀", value: "공항 셔틀" },
  { label: "무료 취소", value: "무료 취소" },
];

const amenityOptions = [
  { label: "수영장", value: "수영장" },
  { label: "스파/사우나", value: "스파" },
  { label: "피트니스", value: "피트니스" },
  { label: "바비큐 시설", value: "바비큐 시설" },
  { label: "비즈니스 센터", value: "비즈니스 센터" },
];

const priceMin = 50;
const priceMax = 1200;

const FilterSidebar = ({ filters = defaultFilters, onChange = () => {} }) => {
  const currentPrice = Number(filters?.price ?? priceMax);

  const handlePriceChange = (value) => {
    onChange((prev) => ({
      ...prev,
      price: Number(value),
    }));
  };

  const toggleSelection = (key, value) => {
    onChange((prev) => {
      const prevList = prev?.[key] || [];
      const exists = prevList.includes(value);
      const nextList = exists
        ? prevList.filter((item) => item !== value)
        : [...prevList, value];
      return {
        ...prev,
        [key]: nextList,
      };
    });
  };

  const isChecked = (key, value) => (filters?.[key] || []).includes(value);

  return (
    <div className="filter-sidebar">
      <h3 className="filter-title">필터</h3>

      {/* 1. 가격 필터 */}
      <FilterSection title="가격">
        <div className="price-range-control">
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            value={currentPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="range-slider"
            style={{
              background: `linear-gradient(to right, #112211 0%, #112211 ${
                ((currentPrice - priceMin) / (priceMax - priceMin)) * 100
              }%, #ddd ${
                ((currentPrice - priceMin) / (priceMax - priceMin)) * 100
              }%, #ddd 100%)`,
            }}
          />
          <div className="range-labels">
            <span>₩{priceMin.toLocaleString()}</span>
            <span>₩{currentPrice.toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      <div className="divider"></div>

      {/* 2. 별점 필터 */}
      <FilterSection title="별점">
        <div className="checkbox-group">
          {ratingOptions.map(({ value, label }) => (
            <label key={value} className="checkbox-item">
              <input
                type="checkbox"
                checked={isChecked("ratings", value)}
                onChange={() => toggleSelection("ratings", value)}
              />
              <span className="stars">
                {[...Array(value)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="star-gold" />
                ))}
                {[...Array(5 - value)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="star-gray" />
                ))}
              </span>
              <span className="count">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="divider"></div>

      {/* 3. 무료 혜택 */}
      <FilterSection title="무료 혜택">
        <div className="checkbox-group">
          {freebiesOptions.map(({ label, value }) => (
            <label key={value} className="checkbox-item">
              <input
                type="checkbox"
                checked={isChecked("freebies", value)}
                onChange={() => toggleSelection("freebies", value)}
              />{" "}
              {label}
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="divider"></div>

      {/* 4. 편의시설 */}
      <FilterSection title="편의시설">
        <div className="checkbox-group">
          {amenityOptions.map(({ label, value }) => (
            <label key={value} className="checkbox-item">
              <input
                type="checkbox"
                checked={isChecked("amenities", value)}
                onChange={() => toggleSelection("amenities", value)}
              />{" "}
              {label}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
