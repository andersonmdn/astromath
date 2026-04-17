import "dotenv/config";
import Fastify from "fastify";
import { ZodTypeProvider, serializerCompiler, validatorCompiler, jsonSchemaTransform, jsonSchemaTransformObject } from "fastify-type-provider-zod";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { z } from "zod";
import cors from "@fastify/cors";
import { matchesRoutes } from "./routes/matches.js";
import { rankingRoutes } from "./routes/ranking.js";
import { authRoutes } from "./routes/auth.js";
import authPlugin from "./plugins/auth.js";

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
const PORT = Number(process.env.PORT) || 3001;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: { 
      title: "AstroMath API",
      //description: "API do jogo AstroMath",
      version: "1.0.0"
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  transform: jsonSchemaTransform,
  transformObject: jsonSchemaTransformObject,
});

await app.register(swaggerUi, {
  routePrefix: "/",
  uiConfig: { docExpansion: "list", deepLinking: true },
});

app.get(
  "/health",
  {
    schema: {
      tags: ["health"],
      summary: "Verificação de saúde do serviço",
      response: {
        200: z.object({ status: z.string(), service: z.string() }),
      },
    },
  },
  async () => ({ status: "ok", service: "api" }),
);

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  credentials: true,
});

await app.register(authPlugin);
await app.register(matchesRoutes);
await app.register(rankingRoutes);
await app.register(authRoutes);

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
