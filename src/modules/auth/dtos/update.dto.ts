import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @IsString({ message: 'Username must be a string' })
  @IsOptional()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(30, { message: 'Username must be at most 30 characters' })
  username?: string;

  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(15, { message: 'Password must be at most 15 characters' })
  password?: string;

  @IsString({ message: 'Refresh token must be a string' })
  @IsOptional()
  refreshToken?: string;

  @IsOptional()
  expiresAt?: Date;

  @IsOptional()
  isRevoked?: boolean;
}
