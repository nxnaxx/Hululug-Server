import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecipeDocument = HydratedDocument<Recipe> & {
  created_at: Date;
  updated_at: Date;
};

@Schema()
export class Ingredients {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  unit: string;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Recipe {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Tag' }],
  })
  tags: Types.ObjectId[];

  @Prop({ required: true })
  introduce: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  writer: Types.ObjectId;

  @Prop({ required: true, type: [SchemaFactory.createForClass(Ingredients)] })
  ingredients: Ingredients[];

  @Prop({ required: true })
  cooking_steps: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: [] })
  comments: Types.ObjectId[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
