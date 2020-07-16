import { IInstanceRole } from "./instance-role.type";
import { User } from "discord.js";

export interface IGroupMember {
  user: User;
  instanceRole: IInstanceRole;
}