import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  refreshToken: string;

  @Prop({ required: false })
  expiresAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
