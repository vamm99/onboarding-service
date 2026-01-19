import { Types } from 'mongoose';

export interface OnboardingResponse {
  onboardingId?: Types.ObjectId | string;
  status?: string;
  userId?: Types.ObjectId | string;
  fullName?: string;
  documentNumber?: string;
  email?: string;
  initialAmount?: number;
}
