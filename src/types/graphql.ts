// src/types/graphql.ts

import { IResolvers } from "@graphql-tools/utils";
export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}

export interface SortInput {
  field: string;
  direction: string;
}
export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: string;
  location: string;
  image: string;
  apiId: number;
  favorite: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  getComments?: () => Promise<Comment[]>;
}

export interface Comment {
  id: number;
  characterId: number;
  content: string;
  created: Date;
}

export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface CharacterResponse {
  results: Character[];
  info: PageInfo;
}

export interface ResolverContext {
  req: any;
}

export interface CustomResolvers extends IResolvers {
  Query: {
    characters: (
      parent: any,
      args: { page?: number; filter?: CharacterFilter; sort?: SortInput },
      context: ResolverContext
    ) => Promise<CharacterResponse>;
    character: (
      parent: any,
      args: { id: number },
      context: ResolverContext
    ) => Promise<Character | null>;
  };
  Mutation: {
    toggleFavorite: (
      parent: any,
      args: { id: number },
      context: ResolverContext
    ) => Promise<Character>;
    addComment: (
      parent: any,
      args: { characterId: number; content: string },
      context: ResolverContext
    ) => Promise<Comment>;
    softDeleteCharacter: (
      parent: any,
      args: { id: number },
      context: ResolverContext
    ) => Promise<Character>;
  };
  Character: {
    comments: (parent: Character) => Promise<Comment[]>;
  };
}
