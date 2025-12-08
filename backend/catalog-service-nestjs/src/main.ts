import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors();

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Catalog Service API')
        .setDescription('Product Catalog Management Service')
        .setVersion('1.0')
        .addTag('products')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const port = process.env.PORT || 8082;
    await app.listen(port);
    console.log(`🚀 Catalog Service (NestJS) running on port ${port}`);
    console.log(`📚 Swagger UI: http://localhost:${port}/api-docs`);
}
bootstrap();
