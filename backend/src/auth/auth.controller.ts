import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiExtraModels, getSchemaPath, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('a-auth')
@ApiExtraModels(LoginDto, RegisterDto)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'register' })
  @ApiBody({ schema: { title: 'register', $ref: getSchemaPath(RegisterDto) } })
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerWithCredentials(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'login' })
  @ApiBody({ schema: { title: 'login', $ref: getSchemaPath(LoginDto) } })
  @ApiOkResponse({ description: 'Login exitoso', schema: { example: { access_token: 'eyJhbGciOi...', refresh_token: 'eyJhbGciOi...' } } })
  @ApiBadRequestResponse({ description: 'Datos inválidos (validación)', schema: { example: { statusCode: 400, message: ['username debe ser texto', 'password es obligatoria'], error: 'Bad Request' } } })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async login(@GetUser() user: any) {
    return this.authService.login(user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar tokens (admin y usuarios normales)' })
  @ApiOkResponse({ description: 'Tokens refrescados exitosamente', schema: { example: { access_token: 'eyJhbGciOi...', refresh_token: 'eyJhbGciOi...' } } })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  async refresh(@Body() dto: RefreshTokenDto, @GetUser() user: any) {
    return this.authService.refreshTokens(user.id, dto.refreshToken);
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña (admin y usuarios normales)' })
  @ApiOkResponse({ description: 'Contraseña cambiada exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiBadRequestResponse({ description: 'Contraseña actual incorrecta o datos inválidos' })
  async changePassword(@Body() dto: ChangePasswordDto, @GetUser() user: any) {
    return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }
  @UseGuards(JwtAuthGuard)
  @Post('request-reset-token')
  @ApiOperation({ summary: 'Generar token de reseteo de contraseña - 30 min (admin y usuarios normales)' })
  @ApiOkResponse({ description: 'Token de reseteo generado exitosamente', schema: { example: { resetToken: 'abc123...', expiresAt: '2025-01-01T10:30:00Z' } } })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  async requestReset(@GetUser() user: any) {
    return this.authService.generateResetToken(user.id);
  }
  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Aplicar reseteo de contraseña usando token (público)' })
  @ApiOkResponse({ description: 'Contraseña reseteada exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Token de reseteo inválido, expirado o datos incompletos' })
  @ApiBadRequestResponse({ description: 'Datos de reseteo inválidos o contraseñas no coinciden' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const { resetToken, newPassword, confirmPassword, userId } = dto as any;
    if (!resetToken || !userId) throw new UnauthorizedException('Datos incompletos para reseteo');
    return this.authService.resetPasswordOptimized(userId, resetToken, newPassword, confirmPassword);
  }
}
