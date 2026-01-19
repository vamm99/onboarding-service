import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from '../dtos/register.dto';
import { User, UserDocument } from '../models/users.model';
import { UpdateDto } from '../dtos/update.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async register(user: RegisterDto): Promise<UserDocument> {
    return await this.userModel.create(user);
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  async updatePassword(
    id: string,
    userData: UpdateDto,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, { password: userData.password }, { new: true })
      .exec();
  }

  async updateUser(
    id: string,
    userData: UpdateDto,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, userData, {
        new: true,
      })
      .exec();
  }
}
