export const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const sanitizeString = (str) => {
  return str.replace(/[^a-zA-Z0-9\s]/g, '').trim();
};
