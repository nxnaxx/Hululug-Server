import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment> & {
  _id: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
};

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Comment {
  _id?: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Recipe' })
  recipe_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  writer: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  created_at?: Date;
  updated_at?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
