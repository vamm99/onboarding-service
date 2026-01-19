import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadDto } from '../dtos/payload.dto';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwtSecret'),
    });
  }

  async validate(payload: PayloadDto) {
    const existingUser = await this.authRepository.getUserById(
      payload._id.toString(),
    );

    if (!existingUser) {
      throw new UnauthorizedException('Token is not valid');
    }

    return {
      _id: existingUser._id.toString(),
      name: existingUser.name,
      lastName: existingUser.lastName,
      username: existingUser.username,
    };
  }
}
