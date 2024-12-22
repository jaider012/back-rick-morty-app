import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { sequelize } from "./config/database";
import { redisClient } from "./config/redis";
import { loggingMiddleware } from "./middleware/logging";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(loggingMiddleware);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });

  await server.start();
  server.applyMiddleware({ app });

  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");

    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer().catch(console.error);
