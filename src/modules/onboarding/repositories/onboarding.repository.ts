import { InjectModel } from '@nestjs/mongoose';
import { Onboarding } from '../model/onboarding.model';
import { Model, PaginateModel } from 'mongoose';
import { RegisterOnboardingDto } from '../dtos/register.dto';
import { Paginated } from '../../../common/interfaces/paginate.interface';

export class OnboardingRepository {
  constructor(
    @InjectModel(Onboarding.name)
    private onboardingModel: Model<Onboarding> & PaginateModel<Onboarding>,
  ) {}

  async create(
    userId: string,
    onboardingData: RegisterOnboardingDto,
  ): Promise<Onboarding> {
    return await this.onboardingModel.create({
      ...onboardingData,
      userId,
    });
  }

  async getByOnboardingId(onboardingId: string): Promise<Onboarding | null> {
    return await this.onboardingModel.findById(onboardingId).exec();
  }

  async getOnboardingByUserId(userId: string): Promise<Onboarding | null> {
    return await this.onboardingModel
      .findOne({ userId, status: 'REQUESTED' })
      .exec();
  }

  async getOnboardingsByDocumentNumber(
    documentNumber: string,
  ): Promise<Onboarding[]> {
    return await this.onboardingModel
      .find({
        documentNumber: { $regex: documentNumber, $options: 'i' },
        status: 'REQUESTED',
      })
      .exec();
  }

  async getAllOnboardingsByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Paginated<Onboarding>> {
    return await this.onboardingModel.paginate(
      { userId },
      { page, limit, sort: { createdAt: -1 } },
    );
  }
}
