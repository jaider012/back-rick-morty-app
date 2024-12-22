import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

// Mock Redis
jest.mock("../config/redis", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    connect: jest.fn(),
  },
}));
