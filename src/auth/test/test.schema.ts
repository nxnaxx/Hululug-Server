import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Test extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  nickname: string;

  @Prop()
  introduce: string;

  @Prop()
  profileImage: string;

  @Prop()
  accessToken: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);
