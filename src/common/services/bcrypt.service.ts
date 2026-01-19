import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;

  async hashPassword(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(data, salt);
  }

  async comparePassword(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
