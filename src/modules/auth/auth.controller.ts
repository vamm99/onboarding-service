import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { EncryptedRequestDto } from '../../common/dtos/encrypted-request.dto';
import { EncryptedResponseDto } from '../../common/dtos/encrypted-response.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Throttle } from '@nestjs/throttler';
import { CryptoInterceptor } from '../../common/interceptors/crypto.interceptor';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Register a new user with encrypted data. The request body must contain encryptedData field with the actual registration data encrypted.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: EncryptedResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: EncryptedRequestDto,
    description:
      'Encrypted registration data. The encryptedData field should contain the encrypted RegisterDto payload.',
    examples: {
      example: {
        summary: 'Encrypted registration request',
        value: {
          encryptedData:
            'U2FsdGVkX1/tI5pOUvLDpOul86G6RU3GqjxWA/Li4rqeTPizLetfNV3SylUGdwEeB8LlBoY0s5WJMgQvo3W3uw==',
        },
      },
    },
  })
  @UseInterceptors(CryptoInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with encrypted credentials. The request body must contain encryptedData field with the actual login credentials encrypted.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: EncryptedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    type: EncryptedRequestDto,
    description:
      'Encrypted login credentials. The encryptedData field should contain the encrypted LoginDto payload.',
    examples: {
      example: {
        summary: 'Encrypted login request',
        value: {
          encryptedData:
            'U2FsdGVkX1/tI5pOUvLDpOul86G6RU3GqjxWA/Li4rqeTPizLetfNV3SylUGdwEeB8LlBoY0s5WJMgQvo3W3uw==',
        },
      },
    },
  })
  @UseInterceptors(CryptoInterceptor)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @User('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@User('_id') userId: string) {
    return this.authService.logout(userId);
  }
}
