import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { RegisterProductDto } from './dtos/register.dto';
import { UpdateProductDto } from './dtos/update.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Product } from './model/product.model';
import { Paginated } from '../../common/interfaces/paginate.interface';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async registerProduct(productData: RegisterProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.getProductByName(
      productData.name,
    );
    if (existingProduct) {
      throw new ConflictException('a product with this name already exists');
    }
    const newProduct = await this.productRepository.register(productData);
    await this.cacheManager.del('all_financial_products');
    return newProduct;
  }

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
  ): Promise<Paginated<Product>> {
    return await this.productRepository.getAllProducts(page, limit);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    return product;
  }

  async updateProduct(
    id: string,
    updateData: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    const updated = await this.productRepository.updateProduct(id, updateData);
    if (!updated) throw new BadRequestException('Product could not be updated');
    return updated;
  }

  async removeProduct(id: string): Promise<{ message: string }> {
    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.deleteProduct(id);
    return { message: 'Product successfully deleted' };
  }
}
