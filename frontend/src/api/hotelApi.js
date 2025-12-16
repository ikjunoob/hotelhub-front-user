import api from './axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const hotelApi = {
  // Hotels - auth optional
  getHotels: async (filters = {}) => unwrap(await api.get('/hotels', { params: filters })),
  getHotelDetail: async (hotelId, params = {}) => unwrap(await api.get(`/hotels/${hotelId}`, { params })),
  getHotelRooms: async (hotelId, params = {}) => unwrap(await api.get(`/hotels/${hotelId}/rooms`, { params })),

  // Rooms - auth optional
  getHotelsRooms: async (params = {}) => unwrap(await api.get('/hotels/rooms', { params })),
  getRooms: async (params = {}) => unwrap(await api.get('/rooms', { params })),
};
