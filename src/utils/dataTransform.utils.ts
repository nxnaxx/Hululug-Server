import { Types } from 'mongoose';

export const stringToObjectId = (value: string): Types.ObjectId => {
  return new Types.ObjectId(value);
};

export const decodeQueryParam = (param: string): string => {
  return decodeURIComponent(param);
};
