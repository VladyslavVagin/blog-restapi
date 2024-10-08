import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

export function appCreate(app: INestApplication): void {
    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          }
        }),
      );
    
      // Swagger configuration
      const swaggerConfig = new DocumentBuilder()
        .setTitle('Blog web application API')
        .setDescription('REST API for Blog web application with NestJS.')
        .addServer('http://localhost:3000')
        .setVersion('1.0')
        .build();
      //Instantiate the Document
      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup('api', app, document);
    
      // Setup AWS SDK configuration used uploading the files to S3 bucket
      const configService = app.get(ConfigService);
      config.update({
        credentials: {
          accessKeyId: configService.get('appConfig.awsAccessKeyId'),
          secretAccessKey: configService.get('appConfig.awsSecretAccessKey'),
        },
        region: configService.get('appConfig.awsRegion'),
      })
    
      // Enable CORS
     app.enableCors();
}