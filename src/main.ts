import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ouvert à tout le monde (TEMPORAIRE)
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Cinema microservice")
    .setDescription("API documentation for the cinema microservice")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document, {
    swaggerOptions: {
      operationsSorter: (a: any, b: any) => {
        // GET -> POST -> PATCH -> PUT -> DELETE
        const order: Record<string, number> = {
          get: 1,
          post: 2,
          patch: 3,
          put: 4,
          delete: 5,
        };
        return (order[(a.get("method") || "").toLowerCase()] ?? 999)
          - (order[(b.get("method") || "").toLowerCase()] ?? 999);
      },
    },
  });

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
