import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'b15f4d2e-1234-4abc-9def-889977665500', description: 'Token de restablecimiento enviado al correo' })
  @IsString({ message: 'el token debe ser texto' })
  @IsNotEmpty({ message: 'el token es obligatorio' })
  resetToken: string;

  @ApiProperty({ example: 'uuid-del-usuario', description: 'UUID del usuario que solicita el reseteo' })
  @IsUUID('4', { message: 'userId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'userId es obligatorio' })
  userId: string;

  @ApiProperty({ example: 'NuevaClave123!', description: 'Nueva contraseña segura' })
  @IsString({ message: 'la contraseña debe ser texto' })
  @IsNotEmpty({ message: 'la contraseña es obligatoria' })
  @MinLength(8, { message: 'la contraseña debe tener mínimo 8 caracteres' })
  @MaxLength(100, { message: 'la contraseña debe tener máximo 100 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{};:'",.<>/?]).+$/, { message: 'la contraseña debe incluir mayúsculas, minúsculas, números y un símbolo' })
  newPassword: string;

  @ApiProperty({ example: 'NuevaClave123!', description: 'Confirmación de la nueva contraseña' })
  @IsString({ message: 'la confirmación debe ser texto' })
  @IsNotEmpty({ message: 'la confirmación es obligatoria' })
  confirmPassword: string;
}
