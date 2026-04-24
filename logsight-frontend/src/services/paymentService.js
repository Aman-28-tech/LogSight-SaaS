import api from './api';

export const createCheckoutSession = async () => {
  const response = await api.post('/payments/create-checkout-session');
  return response.data;
};
