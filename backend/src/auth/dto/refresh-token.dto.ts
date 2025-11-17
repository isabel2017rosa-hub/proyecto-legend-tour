import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token de refresco JWT' })
  @IsString({ message: 'el refresh token debe ser texto' })
  @IsNotEmpty({ message: 'el refresh token es obligatorio' })
  @Length(20, 500, { message: 'el refresh token debe tener entre 20 y 500 caracteres' })
  refreshToken: string;
}