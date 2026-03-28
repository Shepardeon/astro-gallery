import { POCKET, PocketBaseCollections } from "./PocketBaseService";

export async function loginAsync(mail: string, pass: string) {
  return await POCKET.collection(PocketBaseCollections.USERS).authWithPassword(
    mail,
    pass,
  );
}
