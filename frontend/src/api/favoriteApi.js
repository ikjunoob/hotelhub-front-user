import api from './axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const favoriteApi = {
  // 즐겨찾기 목록 (auth)
  // 응답: 사용자의 즐겨찾기 목록 (hotel 정보 포함)
  getFavorites: async () => unwrap(await api.get('/favorites')) || [],

  // 즐겨찾기 추가 (auth)
  // body: { hotelId* }
  // 응답: 생성된 favorite
  addFavorite: async (hotelId) => unwrap(await api.post('/favorites', { hotelId })),

  // 즐겨찾기 제거 (auth)
  // path: favorite id
  removeFavorite: async (id) => unwrap(await api.delete(`/favorites/${id}`)),
};

export default favoriteApi;
