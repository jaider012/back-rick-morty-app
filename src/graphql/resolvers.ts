import { IResolvers } from "@graphql-tools/utils";
import { redisClient } from "../config/redis";
import { characterService } from "../services/CharacterService";
import { CharacterFilter, SortInput } from "../types/graphql";

export const resolvers: IResolvers = {
  Query: {
    characters: async (_, { page = 1, filter, sort }) => {
      try {
        const cacheKey = `characters:${JSON.stringify({ page, filter, sort })}`;

        // Check cache first
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }

        // Get data from service
        const result = await characterService.findAll(
          page,
          filter as CharacterFilter,
          sort as SortInput
        );

        // Cache the result
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));

        return result;
      } catch (error) {
        console.error("Error in characters resolver:", error);
        // En lugar de retornar null, retornamos un resultado vacío válido
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

    character: async (_, { id }) => {
      try {
        const cacheKey = `character:${id}`;

        // Check cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }

        const character = await characterService.findById(parseInt(id));

        if (!character) {
          throw new Error("Character not found");
        }

        // Cache the result
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(character));

        return character;
      } catch (error) {
        console.error("Error in character resolver:", error);
        throw error;
      }
    },
  },

  Mutation: {
    toggleFavorite: async (_, { id }) => {
      try {
        const result = await characterService.toggleFavorite(parseInt(id));

        // Limpiar caché del personaje específico
        await redisClient.del(`character:${id}`);

        // Limpiar todas las cachés de listas de personajes
        const characterListKeys = await redisClient.keys("characters:*");
        if (characterListKeys.length > 0) {
          await redisClient.del(characterListKeys);
        }

        return result;
      } catch (error) {
        console.error("Error in toggleFavorite resolver:", error);
        throw error;
      }
    },

    addComment: async (_, { characterId, content }) => {
      try {
        const result = await characterService.addComment(
          parseInt(characterId),
          content
        );

        // Limpiar caché del personaje específico
        await redisClient.del(`character:${characterId}`);

        // Limpiar todas las cachés de listas de personajes
        const characterListKeys = await redisClient.keys("characters:*");
        if (characterListKeys.length > 0) {
          await redisClient.del(characterListKeys);
        }

        return result;
      } catch (error) {
        console.error("Error in addComment resolver:", error);
        throw error;
      }
    },

    softDeleteCharacter: async (_, { id }) => {
      try {
        const result = await characterService.softDelete(parseInt(id));

        // Limpiar caché del personaje específico
        await redisClient.del(`character:${id}`);

        // Limpiar todas las cachés de listas de personajes
        const characterListKeys = await redisClient.keys("characters:*");
        if (characterListKeys.length > 0) {
          await redisClient.del(characterListKeys);
        }

        return result;
      } catch (error) {
        console.error("Error in softDeleteCharacter resolver:", error);
        throw error;
      }
    },
  },

  Character: {
    // Resolver para cargar los comentarios de un personaje
    comments: async (parent) => {
      try {
        const comments = await parent.getComments();
        return comments;
      } catch (error) {
        console.error("Error loading comments:", error);
        return [];
      }
    },
  },
};
