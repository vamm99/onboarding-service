import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Savings Account',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-yield savings account with premium benefits',
  })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 25.99,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @ApiProperty({
    description: 'Whether the product is revoked',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'isRevoked must be a boolean' })
  @IsOptional()
  isRevoked?: boolean;

  @ApiProperty({
    description: 'Soft delete timestamp',
    required: false,
  })
  @IsOptional()
  deleteAt?: Date;
}
