import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const stringToObjectId = (value: string): Types.ObjectId => {
  return new Types.ObjectId(value);
};

export const decodeQueryParam = (param: string): string => {
  return decodeURIComponent(param);
};

export const getUUID = () => uuidv4();
