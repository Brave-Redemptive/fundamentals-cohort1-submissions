import { v4 as uuidv4 } from 'uuid';

export const generateId = () => {
  return uuidv4();
};

export const getCurrentTimestamp = () => {
  return new Date();
};

export const formatDate = (date) => {
  return new Date(date).toISOString();
};
