import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterOnboardingDto {
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name should not be empty' })
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  fullName: string;

  @IsString({ message: 'Document number must be a string' })
  @IsNotEmpty({ message: 'Document number should not be empty' })
  @MinLength(5, {
    message: 'Document number must be at least 5 characters long',
  })
  documentNumber: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Initial amount should not be empty' })
  @IsNumber({}, { message: 'Initial amount must be a number' })
  @Min(0, { message: 'Initial amount must be at least 0' })
  initialAmount: number;
}
