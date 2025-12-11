import api from './axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const couponApi = {
  // 사용 가능 쿠폰 목록 (auth)
  getAvailable: async () => unwrap(await api.get('/coupons/available')) || [],

  // 특정 쿠폰 코드 조회 및 사용 가능 여부 확인
  // 응답: coupon 정보 (대소문자 무시)
  checkCode: async (code) => unwrap(await api.get(`/coupons/code/${code}`)),

  // 쿠폰 적용
  // body: { code, amount }
  // 응답: { coupon, discountAmount, finalAmount }
  apply: async (payload) => unwrap(await api.post('/coupons/apply', payload)),
};

export default couponApi;
