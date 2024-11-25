import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  // Enable CORS for all origins and methods
  app.enableCors({
    origin: '*', // Allows requests from all origins
    methods: '*', // Allows all HTTP methods
  });

  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
