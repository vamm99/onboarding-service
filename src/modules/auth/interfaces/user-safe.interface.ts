import { Types } from 'mongoose';

export interface UserSafe {
  _id: Types.ObjectId | string;
  name: string;
  lastName: string;
  username: string;
  password?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isRevoked?: boolean;
  __v?: number;
}
