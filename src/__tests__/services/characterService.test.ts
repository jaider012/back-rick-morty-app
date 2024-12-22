import { characterService } from "../../services/CharacterService";
import { Character } from "../../database/models/Character";

// Configurar mocks

// Mock de Comment
jest.mock("../../database/models/Comment", () => ({
  Comment: {
    init: jest.fn(),
    belongsTo: jest.fn(),
  },
}));

jest.mock("../../database/models/Character");
jest.mock("../../config/redis", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  },
}));

describe("CharacterService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return characters with pagination", async () => {
      const mockCharacters = [
        { id: 1, name: "Rick", status: "Alive" },
        { id: 2, name: "Morty", status: "Alive" },
      ];

      const mockCount = 2;

      (Character.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: mockCharacters,
        count: mockCount,
      });

      const result = await characterService.findAll(1);

      expect(result.results).toHaveLength(2);
      expect(result.info.count).toBe(2);
      expect(Character.findAndCountAll).toHaveBeenCalled();
    });

    it("should apply filters correctly", async () => {
      const filter = { status: "Alive", species: "Human" };

      await characterService.findAll(1, filter);

      expect(Character.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining(filter),
        })
      );
    });
  });

  describe("findById", () => {
    it("should return character by id", async () => {
      const mockCharacter = { id: 1, name: "Rick" };
      (Character.findOne as jest.Mock).mockResolvedValue(mockCharacter);

      const result = await characterService.findById(1);

      expect(result).toEqual(mockCharacter);
      expect(Character.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1, deleted: false },
        })
      );
    });
  });

  describe("toggleFavorite", () => {
    it("should toggle favorite status", async () => {
      const mockCharacter = {
        id: 1,
        favorite: false,
        save: jest.fn(),
      };

      (Character.findByPk as jest.Mock).mockResolvedValue(mockCharacter);

      await characterService.toggleFavorite(1);

      expect(mockCharacter.favorite).toBe(true);
      expect(mockCharacter.save).toHaveBeenCalled();
    });
  });
});
