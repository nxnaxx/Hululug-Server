import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecipeDocument = HydratedDocument<RecipePreview>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class RecipePreview {
  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Recipe' }],
  })
  recipe_id: Types.ObjectId[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Tag' }],
  })
  tags: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  writer: Types.ObjectId;

  @Prop({ default: 0 })
  likes: number;
}

export const PreviewSchema = SchemaFactory.createForClass(RecipePreview);
