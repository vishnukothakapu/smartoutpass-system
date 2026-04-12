import api from './index';

/** Update editable profile fields (hostel, room, mobile, fatherName, fatherMobile) */
export const updateProfile = async (fields) => {
  const { data } = await api.patch('/auth/profile', fields);
  return data; // returns { user: updatedUser }
};
