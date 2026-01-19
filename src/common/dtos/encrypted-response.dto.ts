import { ApiProperty } from '@nestjs/swagger';

export class EncryptedResponseDto {
  @ApiProperty({
    description:
      'Encrypted response data. The response data is encrypted using AES encryption.',
    example:
      'U2FsdGVkX1/tI5pOUvLDpOul86G6RU3GqjxWA/Li4rqeTPizLetfNV3SylUGdwEeB8LlBoY0s5WJMgQvo3W3uw==',
  })
  encryptedData: string;
}
