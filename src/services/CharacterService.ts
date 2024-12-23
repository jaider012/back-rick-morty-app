import { Op } from "sequelize";
import { Character } from "../database/models/Character";
import { redisClient } from "../config/redis";
import { CharacterFilter, SortInput } from "../types/graphql";
import { measureExecutionTime } from "../decorators/performance";
import { Comment } from "../database/models/Comment";

export class CharacterService {
  private static CACHE_TTL = 3600; // 1 hour in seconds

  @measureExecutionTime
  async findAll(page = 1, filter?: CharacterFilter, sort?: SortInput) {
    const limit = 20;
    const offset = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    if (filter) {
      if (filter.name) {
        where.name = { [Op.iLike]: `%${filter.name}%` };
      }
      if (filter.status) {
        where.status = filter.status;
      }
      if (filter.species) {
        where.species = filter.species;
      }
      if (filter.type) {
        where.type = filter.type;
      }
      if (filter.gender) {
        where.gender = filter.gender;
      }

      if (filter.favoriteFilter) {
        where.favorite = filter.favoriteFilter;
      }
    }

    // Add non-deleted condition
    where.deleted = false;

    // Build sort options
    const order: any = [];
    if (sort) {
      order.push([sort.field, sort.direction.toUpperCase()]);
    }

    const { count, rows } = await Character.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      results: rows,
      info: {
        count,
        pages: totalPages,
        next: page < totalPages ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
    };
  }

  @measureExecutionTime
  async findById(id: number) {
    return Character.findOne({
      where: {
        id,
        deleted: false,
      },
    });
  }

  @measureExecutionTime
  async toggleFavorite(id: number) {
    const character = await Character.findByPk(id);
    if (!character) {
      throw new Error("Character not found");
    }

    character.favorite = !character.favorite;
    await character.save();

    // Invalidate cache for this character
    await redisClient.del(`character:${id}`);
    await this.invalidateCharacterListCache();

    return character;
  }

  @measureExecutionTime
  async softDelete(id: number) {
    const character = await Character.findByPk(id);
    if (!character) {
      throw new Error("Character not found");
    }

    character.deleted = true;
    await character.save();

    // Invalidate cache
    await redisClient.del(`character:${id}`);
    await this.invalidateCharacterListCache();

    return character;
  }

  @measureExecutionTime
  async addComment(characterId: number, content: string) {
    // Since Comment model is not provided in the initial setup, we'll create it here
    const character = await Character.findByPk(characterId);
    if (!character) {
      throw new Error("Character not found");
    }

    // Assuming we have a Comment model
    const comment = await Comment.create({
      characterId,
      content,
      created: new Date(),
    });

    // Invalidate cache for this character
    await redisClient.del(`character:${characterId}`);

    return comment;
  }

  private async invalidateCharacterListCache() {
    const keys = await redisClient.keys("characters:*");
    if (keys?.length > 0) {
      await redisClient.del(keys);
    }
  }

  // Cache management methods
  async cacheCharacter(id: number, data: any) {
    await redisClient.setEx(
      `character:${id}`,
      CharacterService.CACHE_TTL,
      JSON.stringify(data)
    );
  }

  async cacheCharacterList(key: string, data: any) {
    await redisClient.setEx(
      `characters:${key}`,
      CharacterService.CACHE_TTL,
      JSON.stringify(data)
    );
  }
}

export const characterService = new CharacterService();
