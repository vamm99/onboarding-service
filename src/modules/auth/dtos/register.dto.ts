import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @ApiProperty({
    description: 'User last name (3-30 characters)',
    example: 'Doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name should not be empty' })
  @MinLength(3, { message: 'Last name must be at least 3 characters' })
  @MaxLength(30, { message: 'Last name must be at most 30 characters' })
  lastName: string;

  @ApiProperty({
    description: 'Unique username for authentication (3-30 characters)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(30, { message: 'Username must be at most 30 characters' })
  username: string;

  @ApiProperty({
    description: 'User password (6-15 characters)',
    example: 'SecurePass123',
    minLength: 6,
    maxLength: 15,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(15, { message: 'Password must be at most 15 characters' })
  password: string;
}
