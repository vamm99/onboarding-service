import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { RegisterOnboardingDto } from './dtos/register.dto';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CryptoInterceptor } from '../../common/interceptors/crypto.interceptor';

@UseGuards(JwtAuthGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('/register')
  @UseInterceptors(CryptoInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async registerOnboarding(
    @Body() onboardingData: RegisterOnboardingDto,
    @User('_id') userId: string,
  ) {
    return await this.onboardingService.registerOnboarding(
      userId,
      onboardingData,
    );
  }

  @Get()
  async getAllOnboardingsByUserId(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @User('_id') userId: string,
  ) {
    return await this.onboardingService.getAllOnboardingsByUserId(
      userId,
      page,
      limit,
    );
  }
}
