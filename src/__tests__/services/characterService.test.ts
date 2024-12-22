import { resolvers } from "../../graphql/resolvers";
import { characterService } from "../../services/CharacterService";
import { redisClient } from "../../config/redis";

// Mock dependencies
jest.mock("../../services/CharacterService");
jest.mock("../../config/redis");

describe("GraphQL Resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Query", () => {
    describe("characters", () => {
      const mockCharacters = {
        results: [{ id: 1, name: "Rick" }],
        info: { count: 1, pages: 1 },
      };

      it("should return characters from service", async () => {
        (characterService.findAll as jest.Mock).mockResolvedValue(
          mockCharacters
        );

        const result = await resolvers.Query.characters(
          null,
          { page: 1 },
          { req: {} }
        );

        expect(result).toEqual(mockCharacters);
        expect(characterService.findAll).toHaveBeenCalledWith(
          1,
          undefined,
          undefined
        );
      });

      it("should handle filters and sorting", async () => {
        const filter = { status: "Alive" };
        const sort = { field: "name", direction: "ASC" };

        (characterService.findAll as jest.Mock).mockResolvedValue(
          mockCharacters
        );

        await resolvers.Query.characters(
          null,
          { page: 1, filter, sort },
          { req: {} }
        );

        expect(characterService.findAll).toHaveBeenCalledWith(1, filter, sort);
      });
    });

    describe("character", () => {
      const mockCharacter = { id: 1, name: "Rick" };

      it("should return character from cache if available", async () => {
        (redisClient.get as jest.Mock).mockResolvedValue(
          JSON.stringify(mockCharacter)
        );

        const result = await resolvers.Query.character(
          null,
          { id: 1 },
          { req: {} }
        );

        expect(result).toEqual(mockCharacter);
        expect(redisClient.get).toHaveBeenCalledWith("character:1");
        expect(characterService.findById).not.toHaveBeenCalled();
      });

      it("should fetch and cache character if not in cache", async () => {
        (redisClient.get as jest.Mock).mockResolvedValue(null);
        (characterService.findById as jest.Mock).mockResolvedValue(
          mockCharacter
        );

        const result = await resolvers.Query.character(
          null,
          { id: 1 },
          { req: {} }
        );

        expect(result).toEqual(mockCharacter);
        expect(characterService.findById).toHaveBeenCalledWith(1);
        expect(redisClient.setEx).toHaveBeenCalledWith(
          "character:1",
          3600,
          JSON.stringify(mockCharacter)
        );
      });
    });
  });

  describe("Mutation", () => {
    describe("toggleFavorite", () => {
      it("should toggle favorite status", async () => {
        const mockCharacter = { id: 1, favorite: true };
        (characterService.toggleFavorite as jest.Mock).mockResolvedValue(
          mockCharacter
        );

        const result = await resolvers.Mutation.toggleFavorite(
          null,
          { id: 1 },
          { req: {} }
        );

        expect(result).toEqual(mockCharacter);
        expect(characterService.toggleFavorite).toHaveBeenCalledWith(1);
      });
    });

    describe("addComment", () => {
      it("should add comment to character", async () => {
        const mockComment = { id: 1, content: "Test comment" };
        (characterService.addComment as jest.Mock).mockResolvedValue(
          mockComment
        );

        const result = await resolvers.Mutation.addComment(
          null,
          { characterId: 1, content: "Test comment" },
          { req: {} }
        );

        expect(result).toEqual(mockComment);
        expect(characterService.addComment).toHaveBeenCalledWith(
          1,
          "Test comment"
        );
      });
    });
  });
});
