import api from './axios';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const paymentMethodApi = {
  // 저장된 카드 목록 (auth)
  // 응답: 카드 목록 (마스킹 번호, last4, isDefault 등)
  list: async () => unwrap(await api.get('/payment-methods')) || [],

  // 카드 추가 (auth)
  // body: { cardNumber(12-30), cardExpirationYear(2-4), cardExpirationMonth(1-2), cardHolder?, nickname?, cardBrand?, country?, isDefault? }
  create: async (payload) => unwrap(await api.post('/payment-methods', payload)),

  // 카드 삭제 (auth)
  remove: async (id) => unwrap(await api.delete(`/payment-methods/${id}`)),

  // 기본 결제수단 설정 (auth)
  setDefault: async (id) => unwrap(await api.patch(`/payment-methods/${id}/default`)),
};

export default paymentMethodApi;
