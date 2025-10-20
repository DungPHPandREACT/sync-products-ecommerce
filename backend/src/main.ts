import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust proxy for rate limiting behind reverse proxy
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3001'],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false, // Bearer tokens, không dùng cookie
  });

  // Cookie parser for reading httpOnly cookies
  app.use(cookieParser());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // API prefix
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // Serve static files (frontend build)
  app.useStaticAssets(join(__dirname, '..', '..', '..', 'frontend', 'dist'));
  app.setBaseViewsDir(join(__dirname, '..', '..', '..', 'frontend', 'dist'));
  app.setViewEngine('html');

  // Serve verification files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Serve frontend for all non-API routes
  app.use('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }
    res.sendFile(join(__dirname, '..', '..', '..', 'frontend', 'dist', 'index.html'));
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Sync Products Ecommerce API')
    .setDescription('API for syncing products and orders across platforms')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // On Railway/Heroku, platform provides PORT env. Fallback to API_PORT or 3000 locally
  const port = Number(process.env.PORT) || Number(process.env.API_PORT) || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
