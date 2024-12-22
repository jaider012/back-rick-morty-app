import { CustomResolvers } from "../types/graphql";
import { characterService } from "../services/CharacterService";
import { redisClient } from "../config/redis";

export const resolvers: CustomResolvers = {
  Query: {
    characters: async (_, { page = 1, filter, sort }, context) => {
      try {
        const result = await characterService.findAll(page, filter, sort);
        return result;
      } catch (error) {
        return {
          results: [],
          info: {
            count: 0,
            pages: 0,
            next: null,
            prev: null,
          },
        };
      }
    },

    character: async (_, { id }, context) => {
      try {
        const cacheKey = `character:${id}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
          return JSON.parse(cached);
        }

        const character = await characterService.findById(id);
        if (!character) {
          throw new Error("Character not found");
        }

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(character));
        return character;
      } catch (error) {
        console.error("Error in character resolver:", error);
        throw error;
      }
    },
  },

  Mutation: {
    toggleFavorite: async (_, { id }, context) => {
      try {
        return await characterService.toggleFavorite(id);
      } catch (error) {
        console.error("Error in toggleFavorite resolver:", error);
        throw error;
      }
    },

    addComment: async (_, { characterId, content }, context) => {
      try {
        return await characterService.addComment(characterId, content);
      } catch (error) {
        console.error("Error in addComment resolver:", error);
        throw error;
      }
    },

    softDeleteCharacter: async (_, { id }, context) => {
      try {
        return await characterService.softDelete(id);
      } catch (error) {
        console.error("Error in softDeleteCharacter resolver:", error);
        throw error;
      }
    },
  },

  Character: {
    comments: async (parent) => {
      try {
        if (parent.getComments) {
          return await parent.getComments();
        } else {
          console.error("getComments is undefined for parent:", parent);
          return [];
        }
      } catch (error) {
        console.error("Error loading comments:", error);
        return [];
      }
    },
  },
};
