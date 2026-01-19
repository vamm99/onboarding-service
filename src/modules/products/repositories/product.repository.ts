import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../model/product.model';
import { Model, PaginateModel } from 'mongoose';
import { RegisterProductDto } from '../dtos/register.dto';
import { UpdateProductDto } from '../dtos/update.dto';
import { Paginated } from '../../../common/interfaces/paginate.interface';

export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product> & PaginateModel<Product>,
  ) {}

  async register(productData: RegisterProductDto): Promise<Product> {
    return await this.productModel.create(productData);
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productModel
      .findOne({ _id: id, isRevoked: false })
      .exec();
  }

  async getProductByName(name: string): Promise<Product | null> {
    return await this.productModel
      .findOne({ name: { $regex: name, $options: 'i' }, isRevoked: false })
      .exec();
  }

  async getAllProducts(
    page: number,
    limit: number,
  ): Promise<Paginated<Product>> {
    return await this.productModel.paginate(
      { isRevoked: false },
      {
        page,
        limit,
        sort: { createdAt: -1 },
      },
    );
  }

  async updateProduct(
    productId: string,
    productData: UpdateProductDto,
  ): Promise<Product | null> {
    return await this.productModel
      .findByIdAndUpdate(productId, productData, { new: true })
      .exec();
  }

  async deleteProduct(productId: string): Promise<Product | null> {
    return await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          deleteAt: new Date(),
          isRevoked: true,
        },
        { new: true },
      )
      .exec();
  }
}
