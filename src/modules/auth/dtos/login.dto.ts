import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication (3-30 characters)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(30, { message: 'Username must be at most 30 characters' })
  username!: string;

  @ApiProperty({
    description: 'Password for authentication (6-15 characters)',
    example: 'SecurePass123',
    minLength: 6,
    maxLength: 15,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(15, { message: 'Password must be at most 15 characters' })
  password!: string;
}
