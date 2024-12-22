import { IResolvers } from "@graphql-tools/utils";
import { redisClient } from "../config/redis";

export const resolvers: IResolvers = {
  Query: {
    characters: async (_, { page, filter, sort }, { dataSources }) => {
      const cacheKey = `characters:${JSON.stringify({ page, filter, sort })}`;

      // Check cache first
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // If not in cache, fetch from database
      // Implementation pending...
      return null;
    },
    character: async (_, { id }, { dataSources }) => {
      const cacheKey = `character:${id}`;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Implementation pending...
      return null;
    },
  },
  Mutation: {
    toggleFavorite: async (_, { id }, { dataSources }) => {
      // Implementation pending...
      return null;
    },
    addComment: async (_, { characterId, content }, { dataSources }) => {
      // Implementation pending...
      return null;
    },
    softDeleteCharacter: async (_, { id }, { dataSources }) => {
      // Implementation pending...
      return null;
    },
  },
};
