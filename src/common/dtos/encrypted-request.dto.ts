import { ApiProperty } from '@nestjs/swagger';

export class EncryptedRequestDto {
  @ApiProperty({
    description:
      'Encrypted data payload. The actual request data is encrypted using AES encryption.',
    example:
      'U2FsdGVkX1/tI5pOUvLDpOul86G6RU3GqjxWA/Li4rqeTPizLetfNV3SylUGdwEeB8LlBoY0s5WJMgQvo3W3uw==',
  })
  encryptedData: string;
}
