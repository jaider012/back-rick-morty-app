import { characterService } from "../../services/CharacterService";
import { resolvers } from "../../graphql/resolvers";
import { redisClient } from "../../config/redis";

jest.mock("../services/characterService");
jest.mock("../config/redis");

describe("GraphQL Resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Query", () => {
    describe("characters", () => {
      it("should return characters from cache if available", async () => {
        const cachedData = {
          results: [{ id: 1, name: "Rick" }],
          info: { count: 1, pages: 1 },
        };

        (redisClient.get as jest.Mock).mockResolvedValue(
          JSON.stringify(cachedData)
        );

        const result = await resolvers.Query.characters({}, {}, {});

        expect(result).toEqual(cachedData);
        expect(redisClient.get).toHaveBeenCalled();
        expect(characterService.findAll).not.toHaveBeenCalled();
      });

      it("should fetch and cache characters if not in cache", async () => {
        const characterData = {
          results: [{ id: 1, name: "Rick" }],
          info: { count: 1, pages: 1 },
        };

        (redisClient.get as jest.Mock).mockResolvedValue(null);
        (characterService.findAll as jest.Mock).mockResolvedValue(
          characterData
        );

        const result = await resolvers.Query.characters({}, {}, {});

        expect(result).toEqual(characterData);
        expect(characterService.findAll).toHaveBeenCalled();
        expect(redisClient.setEx).toHaveBeenCalled();
      });
    });
  });

  describe("Mutation", () => {
    it("should toggle favorite status", async () => {
      const mockCharacter = { id: 1, favorite: true };
      (characterService.toggleFavorite as jest.Mock).mockResolvedValue(
        mockCharacter
      );

      const result = await resolvers.Mutation.toggleFavorite(
        {},
        { id: "1" },
        {}
      );

      expect(result).toEqual(mockCharacter);
      expect(characterService.toggleFavorite).toHaveBeenCalledWith(1);
    });
  });
});
