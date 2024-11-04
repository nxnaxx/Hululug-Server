import { Document, Types } from 'mongoose';

export interface Ramen extends Document {
  _id: Types.ObjectId;
  title: string;
  count: number;
}
