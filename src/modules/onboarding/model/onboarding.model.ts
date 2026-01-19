import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ timestamps: true })
export class Onboarding extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  fullName: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  documentNumber: string;

  @Prop({
    required: true,
    index: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ required: true, min: 0 })
  initialAmount: number;

  @Prop({ default: 'REQUESTED' })
  status: string;
}

export const OnboardingSchema = SchemaFactory.createForClass(Onboarding);
OnboardingSchema.plugin(mongoosePaginate);
