import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './repositories/auth.repository';
import { RegisterDto } from './dtos/register.dto';
import { BcryptService } from '../../common/services/bcrypt.service';
import { LoginDto } from './dtos/login.dto';
import { PayloadDto } from './dtos/payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserSafe } from './interfaces/user-safe.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: RegisterDto): Promise<{
    message: string;
    user: UserSafe;
  }> {
    const { username } = user;
    const userExists = await this.authRepository.getUserByUsername(username);
    if (userExists) {
      throw new ConflictException('this username already exists');
    }

    const hashedPassword = await this.bcryptService.hashPassword(user.password);

    const userCreated = await this.authRepository.register({
      name: user.name,
      lastName: user.lastName,
      username,
      password: hashedPassword,
    });
    if (!userCreated) {
      throw new InternalServerErrorException('User could not be created');
    }

    const userObject = userCreated.toObject();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userObject;

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async login(user: LoginDto): Promise<{
    message: string;
    user: UserSafe;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const { username, password } = user;

    const userExists = await this.authRepository.getUserByUsername(username);

    const passwordToCompare = userExists
      ? userExists.password
      : 'HASH_FICTICIO_DE_RELLENO';

    const isPasswordValid = await this.bcryptService.comparePassword(
      password,
      passwordToCompare,
    );

    if (!userExists || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: PayloadDto = {
      _id: userExists._id,
      name: userExists.name,
      lastName: userExists.lastName,
      username: userExists.username,
    };

    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(
      userExists._id.toString(),
      tokens.refreshToken,
    );
    return {
      message: 'Login successful',
      user: {
        _id: userExists._id,
        name: userExists.name,
        lastName: userExists.lastName,
        username: userExists.username,
      },
      tokens,
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.authRepository.getUserById(userId);

    if (!user || !user.refreshToken || user.isRevoked) {
      throw new UnauthorizedException('Access Denied: Invalid Session');
    }

    const isTokenValid = await this.bcryptService.comparePassword(
      refreshToken,
      user.refreshToken,
    );

    if (!isTokenValid) {
      await this.authRepository.updateUser(userId, {
        isRevoked: true,
      });
      throw new UnauthorizedException('Access Denied: Security Alert');
    }

    const payload: PayloadDto = {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      username: user.username,
    };

    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await this.bcryptService.hashPassword(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.updateUser(userId, {
      refreshToken: hash,
      expiresAt: expiresAt,
      isRevoked: false,
    });
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.updateUser(userId, {
      isRevoked: true,
    });
  }

  private async getTokens(payload: PayloadDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwtSecret'),
        expiresIn: '5m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwtRefreshSecret'),
        expiresIn: '3m',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
