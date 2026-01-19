import { Types } from 'mongoose';

export class PayloadDto {
  _id: Types.ObjectId;
  name: string;
  lastName: string;
  username: string;
}
