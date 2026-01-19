import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { OnboardingRepository } from './repositories/onboarding.repository';
import { RegisterOnboardingDto } from './dtos/register.dto';
import { OnboardingResponse } from './interfaces/onboarding.interface';
import { Paginated } from '../../common/interfaces/paginate.interface';
import { EncryptionService } from '../../common/services/encryption.service';
import { Onboarding } from './model/onboarding.model';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    private readonly onboardingRepository: OnboardingRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async registerOnboarding(
    userId: string,
    onboardingData: RegisterOnboardingDto,
  ): Promise<OnboardingResponse> {
    const existingUser =
      await this.onboardingRepository.getOnboardingByUserId(userId);

    if (existingUser) {
      throw new ConflictException('Has a pending request');
    }

    const encryptedData = this.encryptForDatabase(onboardingData);

    const newOnboarding = await this.onboardingRepository.create(
      userId,
      encryptedData,
    );

    return {
      onboardingId: newOnboarding._id,
      status: newOnboarding.status,
    };
  }

  async getAllOnboardingsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Paginated<Onboarding>> {
    const onboardings =
      await this.onboardingRepository.getAllOnboardingsByUserId(
        userId,
        page,
        limit,
      );

    if (!onboardings || onboardings.docs.length === 0) {
      throw new NotFoundException('No onboarding processes found for user');
    }

    const decryptedDocs = onboardings.docs.map((doc) =>
      this.decryptFromDatabase(doc),
    );

    return {
      ...onboardings,
      docs: decryptedDocs,
    };
  }

  private encryptForDatabase(
    dto: RegisterOnboardingDto,
  ): RegisterOnboardingDto {
    return {
      fullName: this.encryptionService.encrypt(dto.fullName),
      documentNumber: this.encryptionService.encrypt(dto.documentNumber),
      email: this.encryptionService.encrypt(dto.email),
      initialAmount: dto.initialAmount,
    };
  }

  private decryptFromDatabase(onboarding: Onboarding): Onboarding {
    const plain = onboarding.toObject
      ? (onboarding.toObject() as Onboarding)
      : onboarding;

    try {
      return {
        ...plain,
        fullName: this.safeDecrypt(plain.fullName, 'fullName'),
        documentNumber: this.safeDecrypt(
          plain.documentNumber,
          'documentNumber',
        ),
        email: this.safeDecrypt(plain.email, 'email'),
      } as Onboarding;
    } catch {
      throw new Error(
        'Unable to decrypt sensitive data. Data may be corrupted.',
      );
    }
  }

  private safeDecrypt(encryptedValue: string, fieldName: string): string {
    if (!encryptedValue) {
      return '';
    }

    try {
      const decrypted = this.encryptionService.decrypt(encryptedValue);

      if (!decrypted || decrypted.trim() === '') {
        throw new Error(`Failed to decrypt ${fieldName}`);
      }

      return decrypted;
    } catch {
      throw new Error(`Failed to decrypt ${fieldName}`);
    }
  }
}
