export class Dungeon {
  static currentKeystoneDungeons(): Dungeon[] {
    return this.battleForAzeroth();
  }

  constructor(readonly name: string, readonly aliases: string[], readonly image: string) {}

  hasAlias(alias: string) {
    return this.aliases.includes(alias.toLowerCase());
  }

  private static battleForAzeroth(): Dungeon[] {
    return [
      new this(
        "Atal'Dazar",
        ['ad', 'atal', 'dazar'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-ataldazar.blp&contenthash=b36564bcdbf4a607ccbdb6389dcace2b',
      ),
      new this(
        'Freehold',
        ['fh', 'free', 'freehold'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-freehold.blp&contenthash=79fad7dd7f7793af485680dec237f78f',
      ),
      new this(
        "Kings' Rest",
        ['kr', 'king', 'kings', 'rest'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-kingsrest.blp&contenthash=d6b496eb88db31be1fd0cec7dca38d36',
      ),
      new this(
        'Operation: Mechagon - Junkyard',
        ['jy', 'junk', 'junkyard'],
        'https://wow.tools/casc/preview/chash?buildconfig=eb9dc13f6f32a1b4992b61d6217dd6ab&cdnconfig=590010eef6130ebf592c43f48caea382&filename=interface%2Flfgframe%2Flfgicon-mechagon.blp&contenthash=a9fcf712bb30e5c16775e08e676844ac',
      ),
      new this(
        'Operation: Mechagon - Workshop',
        ['ws', 'work', 'workshop'],
        'https://wow.tools/casc/preview/chash?buildconfig=eb9dc13f6f32a1b4992b61d6217dd6ab&cdnconfig=590010eef6130ebf592c43f48caea382&filename=interface%2Flfgframe%2Flfgicon-mechagon.blp&contenthash=a9fcf712bb30e5c16775e08e676844ac',
      ),
      new this(
        'Shrine of the Storm',
        ['ss', 'sots', 'shrine', 'storm'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-shrineofthestorm.blp&contenthash=01d1b3623a31c86abb3aed9aff05e8d2',
      ),
      new this(
        'Siege of Boralus',
        ['sb', 'sob', 'siege', 'boralus'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-siegeofboralus.blp&contenthash=84006def8c08ca1627cc67d543f4dda6',
      ),
      new this(
        'Temple of Sethraliss',
        ['ts', 'tos', 'temple', 'seth'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-templeofsethraliss.blp&contenthash=656b2501c9e472a6e23db8baa4e74e8a',
      ),
      new this(
        'The MOTHERLODE!!',
        ['ml', 'mother', 'motherlode', '!!'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-themotherlode.blp&contenthash=036008bd2e83fdcc37ec844aac5e7e0b',
      ),
      new this(
        'The Underrot',
        ['ur', 'rot', 'underrot', 'under'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-theunderrot.blp&contenthash=c1ad5ce7a1ecf2f9d4b414712ac6d280',
      ),
      new this(
        'Tol Dagor',
        ['td', 'tol', 'dagor'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-toldagor.blp&contenthash=899cfe920a3f6b4f8b4182d7cdcf8f3a',
      ),
      new this(
        'Waycrest Manor',
        ['wm', 'wcm', 'waycrest', 'manor', 'crest'],
        'https://wow.tools/casc/preview/chash?buildconfig=2b4c11af9a91d3bc71adaaa6c5b43e07&cdnconfig=0333f2438934b3d77820f235e8646c56&filename=interface%2Flfgframe%2Flfgicon-waycrestmanor.blp&contenthash=85d5b8b9db5080463abe042e22ce9510',
      ),
    ];
  }
}
