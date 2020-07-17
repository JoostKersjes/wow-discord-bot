export class Dungeon {
  static currentKeystoneDungeons(): Dungeon[] {
    return this.battleForAzeroth();
  }

  private constructor(readonly name: string, readonly aliases: string[], readonly image: string) {}

  private static battleForAzeroth(): Dungeon[] {
    return [
      new this("Atal'Dazar", ['ad', 'atal', 'dazar'], ''),
      new this('Freehold', ['fh', 'free', 'freehold'], ''),
      new this("Kings' Rest", ['kr', 'king', 'kings', 'rest'], ''),
      new this('Operation: Mechagon - Junkyard', ['jy', 'junk', 'junkyard'], ''),
      new this('Operation: Mechagon - Workshop', ['ws', 'work', 'workshop'], ''),
      new this('Shrine of the Storm', ['ss', 'sots', 'shrine', 'storm'], ''),
      new this('Siege of Boralus', ['sb', 'sob', 'siege', 'boralus'], ''),
      new this('Temple of Sethraliss', ['ts', 'tos', 'temple', 'seth'], ''),
      new this('The MOTHERLODE!!', ['ml', 'mother', 'motherlode', 'the motherlode', '!!'], ''),
      new this('The Underrot', ['ur', 'rot', 'underrot', 'under'], ''),
      new this('Tol Dagor', ['td', 'tol', 'dagor'], ''),
      new this('Waycrest Manor', ['wm', 'waycrest', 'manor', 'crest'], ''),
    ];
  }
}
