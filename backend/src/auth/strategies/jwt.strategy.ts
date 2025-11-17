import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string; // user id
  email: string;
  isAdmin?: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret_key_dev',
    });
  }

  async validate(payload: JwtPayload) {
    // Se devuelve lo que estará en request.user
    return {
      id: payload.sub,
      email: payload.email,
      isAdmin: !!payload.isAdmin,
    };
  }
}
