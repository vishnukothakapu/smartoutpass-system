import api from './index';

/** Fetch all gate logs */
export const getLogs = async () => {
  const { data } = await api.get('/logs');
  return data;
};

/** Security: create a gate log entry */
export const addLog = async (outpassId, studentName, studentId, type, extras = {}) => {
  const { data } = await api.post('/logs', { outpassId, studentName, studentId, type, ...extras });
  return data;
};
