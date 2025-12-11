import api from './axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const reservationApi = {
  // 예약 생성 (auth)
  // body: { roomId* OR room*, hotelId?, checkIn*(date), checkOut*(date), guests*(int>=1), couponCode? }
  // checkOut > checkIn 필수
  createReservation: async (reservationData) => unwrap(await api.post('/reservations', reservationData)),

  // 내 예약 목록 (auth)
  getMyReservations: async () => unwrap(await api.get('/reservations/my')) || [],

  // 예약 상세 조회 (auth)
  getReservationDetail: async (reservationId) => unwrap(await api.get(`/reservations/${reservationId}`)),

  // 예약 취소 (auth)
  // body: { cancelReason? }
  cancelReservation: async (reservationId, payload = {}) => {
    return unwrap(await api.patch(`/reservations/${reservationId}/cancel`, payload));
  },
};
