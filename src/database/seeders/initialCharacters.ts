import axios from "axios";
import { Character } from "../models/Character";
import { sequelize } from "../../config/database";

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Verificar la conexión a la base de datos
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sincronizar el modelo sin force para evitar borrar datos existentes
    await sequelize.sync();
    console.log("Database synchronized.");

    // Verificar si ya existen datos
    const existingCount = await Character.count();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} characters. Skipping seeding.`);
      return;
    }

    // Obtener datos de la API
    console.log("Fetching characters from Rick & Morty API...");
    const response = await axios.get(
      "https://rickandmortyapi.com/api/character"
    );
    const characters = response.data.results.slice(0, 15);

    // Crear los personajes
    console.log("Creating characters in database...");
    for (const char of characters) {
      await Character.create({
        name: char.name,
        status: char.status,
        species: char.species,
        type: char.type || "",
        gender: char.gender,
        origin: char.origin.name,
        location: char.location.name,
        image: char.image,
        apiId: char.id, // Añadimos el ID de la API
        favorite: false,
        deleted: false
      });
      console.log(`Created character: ${char.name}`);
    }

    console.log("Database seeded successfully!");
    
    // Mostrar resumen
    const finalCount = await Character.count();
    console.log(`Total characters in database: ${finalCount}`);

  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
}

// Función para resetear la base de datos si es necesario
async function resetDatabase() {
  try {
    console.log("Resetting database...");
    await sequelize.sync({ force: true });
    console.log("Database reset successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

// Ejecutar el seeder
if (require.main === module) {
  // Verificar si se solicita un reset
  const shouldReset = process.argv.includes('--reset');
  
  if (shouldReset) {
    resetDatabase().then(() => seedDatabase());
  } else {
    seedDatabase();
  }
}