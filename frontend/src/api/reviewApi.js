import api from './axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const reviewApi = {
  // 리뷰 생성 (auth)
  // body: { reservationId*, hotelId*, rating*(1-5), comment*, images?(uri[]) }
  create: async (payload) => unwrap(await api.post('/reviews', payload)),

  // 리뷰 목록
  // query: hotelId?
  list: async (params = {}) => unwrap(await api.get('/reviews', { params })) || [],

  // 내 리뷰 목록 (auth)
  getMyReviews: async () => unwrap(await api.get('/reviews/my')) || [],

  // 리뷰 수정 (auth)
  // body(>=1개): { rating?(1-5), comment?, images?(uri[]) }
  update: async (id, payload) => unwrap(await api.patch(`/reviews/${id}`, payload)),

  // 리뷰 삭제 (auth)
  remove: async (id) => unwrap(await api.delete(`/reviews/${id}`)),

  // 리뷰 신고 (auth)
  // body: { reason*(min 3 chars) }
  report: async (id, payload) => unwrap(await api.post(`/reviews/${id}/report`, payload)),
};
