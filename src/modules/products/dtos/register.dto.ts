import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RegisterProductDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @IsBoolean({ message: 'isRevoked must be a boolean' })
  @IsOptional()
  isRevoked?: boolean;

  @IsOptional()
  deleteAt?: Date;
}
