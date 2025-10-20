import { Controller, Post, Get, Body, UseGuards, Request, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(
    @Body() loginDto: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.login(user);
    // Trả về Bearer tokens để FE lưu localStorage
    return {
      user: { id: user.id, username: user.username },
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Request() req) {
    return req.user;
  }

  // Giữ alias POST để tương thích tạm thời nếu FE còn gọi POST
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOperation({ summary: 'Get user profile (POST alias)' })
  getProfilePost(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: { refreshToken: string }) {
    const token = body?.refreshToken;
    if (!token) {
      throw new HttpException('Missing refresh token', HttpStatus.UNAUTHORIZED);
    }
    const { access_token } = await this.authService.refresh(token);
    return { accessToken: access_token };
  }
}
