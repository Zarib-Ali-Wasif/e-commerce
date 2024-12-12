import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Environment Variables and Port
  const PORT = process.env.PORT || 3000;

  // CORS Configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allows specific origins if defined; defaults to all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Common HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
    credentials: true, // Allow credentials if needed
  });

  // Error Handling and Initialization
  try {
    await app.listen(PORT);
    Logger.log(
      `🚀 Application is running on: http://localhost:${PORT}`,
      'Bootstrap',
    );
  } catch (error: any) {
    Logger.error(
      `❌ Failed to start the application: ${error.message}`,
      '',
      'Bootstrap',
    );
    process.exit(1); // Exit the process with a failure code
  }
}

bootstrap();
