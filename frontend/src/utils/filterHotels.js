export const defaultFilters = {
  price: null, // null일 때는 가격 필터 미적용
  ratings: [],
  freebies: [],
  amenities: [],
};

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalize = (text = "") => text.toString().toLowerCase();

const extractRating = (hotel) => {
  const candidates = [
    hotel?.ratingAverage,
    hotel?.rating,
    hotel?.stars,
    hotel?.starRating,
    hotel?.star,
    hotel?.ratingScore,
    hotel?.ratingValue,
  ];

  for (const value of candidates) {
    if (value === undefined || value === null) continue;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      // "★★★★★" 형태일 때 별 개수 세기
      if (value.includes("★")) {
        const starCount = (value.match(/★/g) || []).length;
        if (starCount > 0) return starCount;
      }
      const num = Number(value);
      if (Number.isFinite(num)) return num;
    }
  }
  return 0;
};

// 클라이언트 단에서 가격/별점/무료 혜택/편의시설 필터 적용
export const filterHotels = (hotels = [], filters = defaultFilters) => {
  if (!Array.isArray(hotels)) return [];

  return hotels.filter((hotel) => {
    const priceValue = toNumber(
      hotel.price ??
        hotel.basePrice ??
        hotel.pricePerNight ??
        hotel.rate ??
        hotel.nightlyPrice ??
        hotel.originalPrice,
      0
    );
    const meetsPrice =
      filters.price === null || filters.price === undefined
        ? true
        : priceValue <= filters.price;

    const ratingValue = extractRating(hotel);
    const meetsRating =
      !filters.ratings?.length ||
      filters.ratings.some((rating) => ratingValue >= rating);

    const combinedAmenityText = normalize(
      `${(hotel.amenities || []).join(" ")} ${(hotel.freebies || []).join(" ")} ${
        hotel.description || ""
      }`
    );

    const freebiesMatch = (filters.freebies || []).every((freebie) =>
      combinedAmenityText.includes(freebie.toLowerCase())
    );
    const amenitiesMatch = (filters.amenities || []).every((amenity) =>
      combinedAmenityText.includes(amenity.toLowerCase())
    );

    return meetsPrice && meetsRating && freebiesMatch && amenitiesMatch;
  });
};
