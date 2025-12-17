import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { favoriteApi } from '../api/favoriteApi';

const WishlistContext = createContext();

const extractId = (target) => {
  if (!target) return undefined;
  if (typeof target === "string") return target;
  return target._id || target.id || target.hotelId || target?.hotel?._id;
};

const normalizeHotel = (hotel = {}) => {
  const id = extractId(hotel);
  const primaryImage = hotel.image || hotel.images?.[0];
  const ratingValue = hotel.rating ?? hotel.ratingAverage ?? hotel.starRating ?? 0;
  const reviewCount = hotel.reviews ?? hotel.ratingCount ?? hotel.reviewsCount ?? 0;
  const priceValue = hotel.price ?? hotel.basePrice ?? hotel.lowestPrice ?? 0;
  const location = hotel.location || hotel.city || hotel.address;
  const amenities =
    Array.isArray(hotel.amenities) && hotel.amenities.length
      ? hotel.amenities.join(", ")
      : hotel.amenities;

  return {
    ...hotel,
    id,
    image: primaryImage,
    rating: ratingValue,
    reviews: reviewCount,
    price: priceValue,
    location,
    amenities,
  };
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthed } = useAuth();
  const [wishlist, setWishlist] = useState([]); // [{ favoriteId?, hotelId, hotel }]

  const derivedHotels = (items) =>
    items.map((item) => normalizeHotel(item.hotel || item));

  const persistLocal = (items) => {
    if (isAuthed) return;
    localStorage.setItem('wishlist', JSON.stringify(derivedHotels(items)));
  };

  const fetchFavorites = async () => {
    try {
      const favorites = await favoriteApi.getFavorites();
      const normalized = (favorites || []).map((fav) => ({
        favoriteId: fav._id || fav.id || fav.favoriteId,
        hotelId: extractId(fav.hotel) || extractId(fav.hotelId),
        hotel: normalizeHotel(fav.hotel || fav.hotelId || fav),
      }));
      setWishlist(normalized);
    } catch (error) {
      console.error('짜 목록 로드 실패:', error);
    }
  };

  // Load initial state (local for guests, remote for authed)
  useEffect(() => {
    if (isAuthed) {
      fetchFavorites();
      return;
    }

    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWishlist(parsed.map((hotel) => ({ hotel: normalizeHotel(hotel), hotelId: extractId(hotel) })));
      } catch (error) {
        console.error('짜 목록 로드 오류:', error);
      }
    } else {
      setWishlist([]);
    }
  }, [isAuthed]);

  const addToWishlist = async (hotel) => {
    const normalizedHotel = normalizeHotel(hotel);
    const hotelId = normalizedHotel.id;

    if (!hotelId) {
      alert("호텔 ID를 확인할 수 없습니다.");
      return;
    }

    if (wishlist.some((item) => extractId(item.hotelId) === hotelId || extractId(item.hotel) === hotelId)) return;

    try {
      if (isAuthed) {
        const created = await favoriteApi.addFavorite(hotelId);
        const favoriteId = created?._id || created?.id;
        setWishlist((prev) => [
          ...prev,
          {
            favoriteId,
            hotelId,
            hotel: normalizeHotel(created?.hotel || normalizedHotel),
          },
        ]);
      } else {
        const next = [...wishlist, { hotelId, hotel: normalizedHotel }];
        setWishlist(next);
        persistLocal(next);
      }
    } catch (error) {
      console.error('짐 추가 실패:', error);
      alert('짐 추가에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const removeFromWishlist = async (hotelId) => {
    const target = wishlist.find(
      (item) => extractId(item.hotelId) === hotelId || extractId(item.hotel) === hotelId
    );

    try {
      if (isAuthed && target?.favoriteId) {
        await favoriteApi.removeFavorite(target.favoriteId);
      }
    } catch (error) {
      console.error('짜 해제 실패:', error);
      alert('짜 해제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      const next = wishlist.filter(
        (item) => extractId(item.hotelId) !== hotelId && extractId(item.hotel) !== hotelId
      );
      setWishlist(next);
      persistLocal(next);
    }
  };

  const isInWishlist = (hotelId) =>
    wishlist.some((item) => extractId(item.hotelId) === hotelId || extractId(item.hotel) === hotelId);

  const toggleWishlist = async (hotel) => {
    const normalizedHotel = normalizeHotel(hotel);
    if (!normalizedHotel.id) {
      alert("호텔 ID를 확인할 수 없습니다.");
      return;
    }
    if (isInWishlist(normalizedHotel.id)) {
      await removeFromWishlist(normalizedHotel.id);
    } else {
      await addToWishlist(normalizedHotel);
    }
  };

  const getWishlist = () => derivedHotels(wishlist);
  const getWishlistCount = () => wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist: derivedHotels(wishlist),
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        getWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
