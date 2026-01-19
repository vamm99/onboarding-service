import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterOnboardingDto {
  @ApiProperty({
    description: 'Full name of the customer (min 3 characters)',
    example: 'John Doe Smith',
    minLength: 3,
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name should not be empty' })
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  fullName: string;

  @ApiProperty({
    description: 'Document identification number (min 5 characters)',
    example: '123456789',
    minLength: 5,
  })
  @IsString({ message: 'Document number must be a string' })
  @IsNotEmpty({ message: 'Document number should not be empty' })
  @MinLength(5, {
    message: 'Document number must be at least 5 characters long',
  })
  documentNumber: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @ApiProperty({
    description: 'Initial amount for account opening',
    example: 1000,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Initial amount should not be empty' })
  @IsNumber({}, { message: 'Initial amount must be a number' })
  @Min(0, { message: 'Initial amount must be at least 0' })
  initialAmount: number;
}
