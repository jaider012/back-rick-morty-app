import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Character {
    id: ID!
    name: String!
    status: String!
    species: String!
    type: String
    gender: String!
    origin: String!
    location: String!
    image: String!
    created: String!
    favorite: Boolean!
    comments: [Comment]!
    deleted: Boolean!
  }

  type Comment {
    id: ID!
    characterId: ID!
    content: String!
    created: String!
  }

  type Query {
    characters(
      page: Int
      filter: CharacterFilter
      sort: SortInput
    ): CharacterResponse!
    character(id: ID!): Character
  }

  type CharacterResponse {
    results: [Character]!
    info: PageInfo!
  }

  type PageInfo {
    count: Int!
    pages: Int!
    next: Int
    prev: Int
  }

  input CharacterFilter {
    name: String
    status: String
    species: String
    type: String
    gender: String
  }

  input SortInput {
    field: String!
    direction: String!
  }

  type Mutation {
    toggleFavorite(id: ID!): Character!
    addComment(characterId: ID!, content: String!): Comment!
    softDeleteCharacter(id: ID!): Character!
  }
`;
