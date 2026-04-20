/**
 * Checks if a student's profile is complete based on mandatory fields.
 * Required fields: hostel, wing, room, mobile, fatherName, fatherMobile.
 * @param {Object} user - The user object from context or local storage.
 * @returns {boolean} - True if all mandatory fields are present, false otherwise.
 */
export const isProfileComplete = (user) => {
  if (!user || user.role !== 'student') return true; // Non-students don't need this check here

  const mandatoryFields = [
    'hostel',
    'wing',
    'room',
    'mobile',
    'fatherName',
    'fatherMobile'
  ];

  return mandatoryFields.every(field => user[field] && user[field].trim() !== '');
};
