import Fastify from "fastify";
import { matchesRoutes } from "./routes/matches.js";
import { rankingRoutes } from "./routes/ranking.js";

const app = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3001;

app.get("/health", async () => {
  return { status: "ok", service: "api" };
});

app.register(matchesRoutes);
app.register(rankingRoutes);

app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
