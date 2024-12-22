import axios from "axios";
import { Character } from "../models/Character";
import { sequelize } from "../../config/database";

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });

    const response = await axios.get(
      "https://rickandmortyapi.com/api/character"
    );
    const characters = response.data.results.slice(0, 15);

    for (const char of characters) {
      await Character.create({
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

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}
