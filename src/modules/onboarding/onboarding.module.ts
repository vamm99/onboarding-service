import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { Onboarding, OnboardingSchema } from './model/onboarding.model';
import { MongooseModule } from '@nestjs/mongoose';
import { OnboardingRepository } from './repositories/onboarding.repository';
import { EncryptionService } from '../../common/services/encryption.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Onboarding.name, schema: OnboardingSchema },
    ]),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, OnboardingRepository, EncryptionService],
})
export class OnboardingModule {}
