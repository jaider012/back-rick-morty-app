# Rick and Morty Backend API

Backend service for Rick and Morty character management built with Express, GraphQL, PostgreSQL, and Redis.

## Tech Stack

- Node.js (v18.x LTS recommended)
- Express
- Apollo Server
- PostgreSQL
- Redis
- Sequelize ORM
- TypeScript
- Jest for testing
- Docker & Docker Compose

## Prerequisites

- Node.js v18.x LTS
- Yarn (recommended) or npm
- Docker and Docker Compose
- Git

## Development Setup

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=rick_morty_db

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=4000
NODE_ENV=development
```

## Running with Docker

1. Start the development environment:
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```

2. Stop the services:
```bash
docker-compose down
```

The following services will be available:
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Backend API: localhost:4000

## Database Setup

```bash
# Create database
yarn db:create

# Run migrations
yarn db:migrate

# Seed initial data
yarn db:seed

# Reset database (caution: this will drop all data)
yarn db:reset
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

## API Documentation

### GraphQL Playground
- Local Development: http://localhost:4000/graphql
- Apollo Studio: https://studio.apollographql.com/sandbox/explorer

### Swagger Documentation
- URL: http://localhost:4000/docs/api-docs
- Contains detailed API endpoints and schema information

## Available Scripts

```bash
# Start development server
yarn dev

# Build the application
yarn build

# Start production server
yarn start

# Run type checking
yarn type-check

# Run linting
yarn lint

# Format code
yarn format
```

## Docker Commands

```bash
# Build the image
docker build -t rick-morty-backend .

# Run development environment
docker-compose -f docker-compose.dev.yml up

# Run production environment
docker-compose -f docker-compose.prod.yml up

# View logs
docker-compose logs -f

# Rebuild a specific service
docker-compose build <service-name>
```

## Project Structure

```
src/
├── config/          # Configuration files
├── database/        # Database models and migrations
├── graphql/         # GraphQL schemas and resolvers
├── services/        # Business logic
├── types/          # TypeScript type definitions
├── middleware/     # Express middlewares
└── utils/          # Utility functions
```

## GraphQL Examples

Test these queries in Apollo Studio (https://studio.apollographql.com/sandbox/explorer)

```graphql
# Get characters with pagination and filters
query GetCharacters {
  characters(
    page: 1
    filter: { status: "Alive", species: "Human" }
    sort: { field: "name", direction: "ASC" }
  ) {
    results {
      id
      name
      status
      species
    }
    info {
      count
      pages
    }
  }
}

# Get single character with comments
query GetCharacter {
  character(id: "1") {
    id
    name
    status
    species
    comments {
      id
      content
      created
    }
  }
}

# Add new comment
mutation AddComment {
  addComment(
    characterId: "1"
    content: "This is a test comment"
  ) {
    id
    content
    created
  }
}
```

## Database Schema

Access the ERD diagram: [Database ERD](./docs/database-erd.png)

## Contributing

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Commit your changes:
```bash
git commit -m "feat: add some feature"
```

3. Push to the branch:
```bash
git push origin feature/your-feature-name
```

4. Submit a pull request

## Monitoring and Maintenance

### Logs
```bash
# View application logs
docker-compose logs app

# View database logs
docker-compose logs db

# View Redis logs
docker-compose logs redis
```

### Database Backups
```bash
# Create a backup
docker exec -t postgres pg_dump -U postgres rick_morty_db > backup.sql

# Restore from backup
docker exec -i postgres psql -U postgres rick_morty_db < backup.sql
```

## Troubleshooting

1. If Redis connection fails:
```bash
# Check Redis status
docker-compose ps redis
# Reset Redis
docker-compose restart redis
```

2. If database migrations fail:
```bash
# Reset database and run migrations again
yarn db:reset
yarn db:migrate
```

3. If node_modules issues:
```bash
# Clean install
rm -rf node_modules
yarn install --frozen-lockfile
```

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
