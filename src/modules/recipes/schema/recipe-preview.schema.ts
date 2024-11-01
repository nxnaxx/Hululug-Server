import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecipePreviewDocument = HydratedDocument<RecipePreview> & {
  created_at: Date;
};

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: false },
  versionKey: false,
})
export class RecipePreview {
  @Prop({ required: true })
  recipe_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Tag' }],
  })
  tags: Types.ObjectId[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  writer: Types.ObjectId;

  @Prop({ default: 0 })
  likes: number;
}

export const PreviewSchema = SchemaFactory.createForClass(RecipePreview);
