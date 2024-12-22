import { redisClient } from "../config/redis";

// Mock Redis
jest.mock("../config/redis", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  },
}));
