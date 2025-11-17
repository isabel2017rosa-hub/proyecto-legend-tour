import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Admin123!', description: 'Contraseña actual del usuario' })
  @IsString({ message: 'la contraseña actual debe ser texto' })
  @IsNotEmpty({ message: 'la contraseña actual es obligatoria' })
  currentPassword: string;

    @ApiProperty({ example: 'NuevoPass123!', description: 'Nueva contraseña' })
  @IsString({ message: 'la nueva contraseña debe ser texto' })
  @IsNotEmpty({ message: 'la nueva contraseña es obligatoria' })
  @MinLength(8, { message: 'la nueva contraseña debe tener mínimo 8 caracteres' })
  @MaxLength(100, { message: 'la nueva contraseña debe tener máximo 100 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{};:'",.<>/?]).+$/, {
    message: 'la nueva contraseña debe incluir mayúsculas, minúsculas, números y un símbolo'
  })
  newPassword: string;

    @ApiProperty({ example: 'NuevoPass123!', description: 'Confirmación de la nueva contraseña' })
  @IsString({ message: 'la confirmación debe ser texto' })
  @IsNotEmpty({ message: 'la confirmación de la nueva contraseña es obligatoria' })
  confirmNewPassword: string;
}
