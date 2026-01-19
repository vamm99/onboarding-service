import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: false })
  deleteAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(mongoosePaginate);
