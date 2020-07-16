export interface IDungeon {
  readonly name: string; // Actual name of the dungeon, identifier
  readonly aliases: string[]; // List of aliases
  readonly image?: string; // Path to embed image
}