import { IDungeon } from "./dungeon.type";
import { IGroupMember } from "./group-member.type";
import { User } from "discord.js";

export interface IKeystone {
  getDescription(): any;
  readonly owner: User;
  readonly dungeon: IDungeon;
  readonly level: number;

  group: IGroupMember[];

  getName(): string;
  isFullGroup(): boolean;
}