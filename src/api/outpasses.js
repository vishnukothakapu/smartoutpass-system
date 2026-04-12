import api from './index';

/** Fetch outpasses (scoped by role on backend) */
export const getOutpasses = async (status = null) => {
  const params = status ? { status } : {};
  const { data } = await api.get('/outpasses', { params });
  return data;
};

/** Fetch a single outpass by ID */
export const getOutpass = async (id) => {
  const { data } = await api.get(`/outpasses/${id}`);
  return data;
};

/** Student: apply for new outpass */
export const createOutpass = async (payload) => {
  const { data } = await api.post('/outpasses', payload);
  return data;
};

/** Warden/Security: update outpass status */
export const updateOutpassStatus = async (id, status) => {
  const { data } = await api.patch(`/outpasses/${id}/status`, { status });
  return data;
};
