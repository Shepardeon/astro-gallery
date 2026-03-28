import PocketBase from "pocketbase";
export const POCKET = new PocketBase(import.meta.env.POKETBASE_URL);

export enum PocketBaseCollections {
  USERS = "users",
  TAGS = "tags",
  IMAGES = "images",
}
