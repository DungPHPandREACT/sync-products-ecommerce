import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // TODO: Implement user validation logic
    if (username === 'admin' && password === 'admin') {
      return { id: 1, username: 'admin' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload as any, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any,
    });
    const refreshToken = this.jwtService.sign(payload as any, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refresh(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    const accessToken = this.jwtService.sign(
      { username: payload.username, sub: payload.sub } as any,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any },
    );
    return { access_token: accessToken };
  }
}
