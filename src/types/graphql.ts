// src/types/graphql.ts

export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}

export interface SortInput {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type?: string;
  gender: string;
  origin: string;
  location: string;
  image: string;
  created: string;
  favorite: boolean;
  comments: Comment[];
  deleted: boolean;
}

export interface Comment {
  id: string;
  characterId: string;
  content: string;
  created: string;
}

export interface CharacterResponse {
  results: Character[];
  info: PageInfo;
}