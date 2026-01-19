import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class CryptoInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CryptoInterceptor.name);
  private readonly encryptionKey: string;

  constructor(private configService: ConfigService) {
    this.encryptionKey = this.configService.get<string>('encryptionKey')!;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      this.decryptRequest(request);
    }

    return next.handle().pipe(
      map((data) => {
        return this.encryptResponse(data);
      }),
    );
  }

  private decryptRequest(request: Request): void {
    const body = request.body as Record<string, unknown>;

    if (!body || typeof body.encryptedData !== 'string') {
      throw new BadRequestException(
        'Security Policy: Missing encryptedData field',
      );
    }

    try {
      const bytes = CryptoJS.AES.decrypt(
        body.encryptedData,
        this.encryptionKey,
      );
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new BadRequestException('Invalid encryption format or key');
      }

      request.body = JSON.parse(decryptedText) as Record<string, unknown>;
      this.logger.log(`Incoming data decrypted for: ${request.url}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Decryption failed: ${msg}`);
      throw new BadRequestException('Malformed encrypted payload');
    }
  }

  private encryptResponse(data: unknown): unknown {
    if (!data) return data;

    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.encryptionKey,
      ).toString();

      this.logger.log('Outgoing response encrypted successfully');

      return { encryptedData };
    } catch (error: unknown) {
      this.logger.error(
        'Error encrypting response',
        error instanceof Error ? error : undefined,
      );
      return data;
    }
  }
}
