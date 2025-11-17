import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString({ message: 'el nombre de usuario debe ser texto' })
  @IsNotEmpty({ message: 'el nombre de usuario es obligatorio' })
  @MinLength(3, { message: 'mínimo 3 caracteres' })
  @MaxLength(50, { message: 'máximo 50 caracteres' })
  username: string;

    @ApiProperty({ example: 'Admin123!', description: 'Contraseña del usuario' })
  @IsString({ message: 'la contraseña debe ser texto' })
  @IsNotEmpty({ message: 'la contraseña es obligatoria' })
  @MinLength(8, { message: 'mínimo 8 caracteres' })
  @MaxLength(100, { message: 'máximo 100 caracteres' })
  password: string;
}
