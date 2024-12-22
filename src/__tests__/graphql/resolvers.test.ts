import { characterService } from "../../services/CharacterService";
import { resolvers } from "../../graphql/resolvers";
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
        results: [
          {
            id: 1,
            name: "Rick",
            status: "Alive",
            species: "Human",
            type: "",
            gender: "Male",
            origin: "Earth",
            location: "Earth",
            image: "rick.jpg",
            favorite: false,
            deleted: false,
          },
        ],
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      };

      it("should return all characters successfully", async () => {
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

      it("should handle filters correctly", async () => {
        const filter = {
          status: "Alive",
          species: "Human",
          gender: "Male",
        };

        (characterService.findAll as jest.Mock).mockResolvedValue(
          mockCharacters
        );

        await resolvers.Query.characters(
          null,
          { page: 1, filter },
          { req: {} }
        );

        expect(characterService.findAll).toHaveBeenCalledWith(
          1,
          filter,
          undefined
        );
      });

      it("should handle sorting correctly", async () => {
        const sort = {
          field: "name",
          direction: "ASC",
        };

        (characterService.findAll as jest.Mock).mockResolvedValue(
          mockCharacters
        );

        await resolvers.Query.characters(null, { page: 1, sort }, { req: {} });

        expect(characterService.findAll).toHaveBeenCalledWith(
          1,
          undefined,
          sort
        );
      });

      it("should handle both filters and sorting together", async () => {
        const filter = { status: "Alive" };
        const sort = { field: "name", direction: "DESC" };

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

      it("should handle errors gracefully", async () => {
        (characterService.findAll as jest.Mock).mockRejectedValue(
          new Error("Database error")
        );

        const result = await resolvers.Query.characters(
          null,
          { page: 1 },
          { req: {} }
        );

        expect(result).toEqual({
          results: [],
          info: {
            count: 0,
            pages: 0,
            next: null,
            prev: null,
          },
        });
      });

      it("should use default page 1 when no page is provided", async () => {
        (characterService.findAll as jest.Mock).mockResolvedValue(
          mockCharacters
        );

        await resolvers.Query.characters(null, {}, { req: {} });

        expect(characterService.findAll).toHaveBeenCalledWith(
          1,
          undefined,
          undefined
        );
      });
    });
  });
});
