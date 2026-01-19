import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Updated Premium Savings Account',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Updated high-yield savings account with enhanced benefits',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be at least 0' })
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 150,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be at least 0' })
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Whether the product is revoked',
    example: true,
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
