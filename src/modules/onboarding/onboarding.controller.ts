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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { RegisterOnboardingDto } from './dtos/register.dto';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CryptoInterceptor } from '../../common/interceptors/crypto.interceptor';
import { EncryptedRequestDto } from '../../common/dtos/encrypted-request.dto';
import { EncryptedResponseDto } from '../../common/dtos/encrypted-response.dto';

@ApiTags('Onboarding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Register a new onboarding process',
    description:
      'Register a new onboarding process with encrypted data. The request body must contain encryptedData field with the actual onboarding data encrypted.',
  })
  @ApiResponse({
    status: 201,
    description: 'Onboarding registered successfully',
    type: EncryptedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: EncryptedRequestDto,
    description:
      'Encrypted onboarding data. The encryptedData field should contain the encrypted RegisterOnboardingDto payload.',
    examples: {
      example: {
        summary: 'Encrypted onboarding request',
        value: {
          encryptedData:
            'U2FsdGVkX1/tI5pOUvLDpOul86G6RU3GqjxWA/Li4rqeTPizLetfNV3SylUGdwEeB8LlBoY0s5WJMgQvo3W3uw==',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Get all onboardings for a user' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Onboardings retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
