import cron from "node-cron";
import axios from "axios";
import { Character } from "../src/database/models/Character";
import { redisClient } from "../src/config/redis";

export const startCharacterUpdateCron = () => {
  cron.schedule("0 */12 * * *", async () => {
    try {
      console.log("Starting character update cron job");

      const response = await axios.get(
        "https://rickandmortyapi.com/api/character"
      );
      const characters = response.data.results.slice(0, 15);

      for (const char of characters) {
        await Character.upsert({
          id: char.id,
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type,
          gender: char.gender,
          origin: char.origin.name,
          location: char.location.name,
          image: char.image,
        });
      }

      // Clear cache
      await redisClient.flushDb();

      console.log("Characters updated successfully");
    } catch (error) {
      console.error("Error updating characters:", error);
    }
  });
};
