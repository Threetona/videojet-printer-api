import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global Validation Pipe
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('Videojet.service');

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('VIDEOJET WSI API')
        .setDescription(
            'Videojet 1000 Line Series WSI (Wide Space Indicator) Communications Protocol',
        )
        .setVersion('1.0')
        .addBearerAuth() // Optional: if your API uses JWT authentication
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('Videojet.service', app, document);

    // CORS Configuration
    const corsOptions = {
        origin: '*',
        credentials: true,
        methods: 'POST',
        // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    };

    app.enableCors(corsOptions);

    await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
