import api from './axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const paymentApi = {
  // 결제 승인 (auth)
  // body: { paymentKey*, orderId*, amount*(number), reservationId*, roomId?, customerName?, customerEmail?(email), customerPhone? }
  // 응답: Toss payment 원본 데이터
  confirmPayment: async (payload) => unwrap(await api.post('/payments/confirm', payload)),

  // 결제 취소 (auth)
  // body: { paymentKey*, cancelReason? }
  // 응답: Toss cancel 원본 데이터
  cancelPayment: async (payload) => unwrap(await api.post('/payments/cancel', payload)),
};

export default paymentApi;
